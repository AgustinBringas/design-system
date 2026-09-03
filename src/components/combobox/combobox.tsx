import { cn } from '@/utils/cn';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, ChevronsUpDown, HelpCircle, Search } from 'lucide-react';
import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { RichText } from '../rich-text';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Extra terms matched against the typed query but not shown in the list (e.g. a spell's school/level). */
  keywords?: string[];
  disabled?: boolean;
  /** Leading icon shown in the option row and, for single-select, in the trigger once chosen. */
  icon?: React.ReactNode;
  /** When set, the option is wrapped in a hover Tooltip showing this text — e.g. a spell's rules text. */
  description?: string;
}

interface ComboboxBaseProps {
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  /** Hide the internal search input — for short, closed option lists where typing to filter adds friction rather than removing it. */
  hideSearch?: boolean;
}

export interface ComboboxSingleProps extends ComboboxBaseProps {
  type?: 'single';
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface ComboboxMultipleProps extends ComboboxBaseProps {
  type: 'multiple';
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

/**
 * The per-option "?" affordance. Radix Tooltip ignores touch pointer events entirely (hover
 * isn't a touch concept), so on a phone this only shows the description because `open` is
 * controlled here and toggled explicitly on click/tap — hover still drives it the normal way
 * on desktop via `onOpenChange`. The click is also stopped from bubbling: cmdk's Item selects
 * on click, and without stopPropagation a tap here would select the option instead of just
 * showing its description. `tabIndex={-1}` keeps it out of the Tab order deliberately — cmdk's
 * combobox pattern keeps DOM focus on the search input and drives option selection with arrow
 * keys, so an extra native Tab stop per visible description would be a non-standard trap here,
 * not an accessibility win.
 */
function ComboboxOptionDescription({ description }: { description: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Show description"
            data-testid="combobox-option-description-icon"
            className="ml-auto shrink-0 rounded text-muted-foreground hover:text-foreground"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[16rem]">
          <RichText>{description}</RichText>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>((props, ref) => {
  const {
    options,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyText = 'No results found.',
    disabled,
    className,
    id,
    hideSearch,
  } = props;

  const [open, setOpen] = React.useState(false);
  const listboxId = React.useId();

  const selectedValues =
    props.type === 'multiple' ? (props.value ?? []) : props.value ? [props.value] : [];

  const handleSelect = (optionValue: string) => {
    if (props.type === 'multiple') {
      const current = props.value ?? [];
      const next = current.includes(optionValue)
        ? current.filter((value) => value !== optionValue)
        : [...current, optionValue];
      props.onValueChange?.(next);
      return;
    }
    props.onValueChange?.(optionValue);
    setOpen(false);
  };

  const triggerLabel = React.useMemo(() => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    return options
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label)
      .join(', ');
  }, [selectedValues, options, placeholder]);

  const triggerIcon =
    props.type !== 'multiple' && props.value
      ? options.find((option) => option.value === props.value)?.icon
      : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={ref}
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm',
            'focus:outline-none focus:ring-1 focus:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            selectedValues.length === 0 && 'text-muted-foreground',
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {triggerIcon}
            <span className="line-clamp-1 min-w-0 text-left">{triggerLabel}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <CommandPrimitive className="overflow-hidden rounded-md">
          {!hideSearch && (
            <div className="flex items-center gap-2 border-b border-border px-3">
              <Search className="h-4 w-4 shrink-0 opacity-50" />
              <CommandPrimitive.Input
                placeholder={searchPlaceholder}
                className={cn(
                  'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none',
                  'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
                )}
              />
            </div>
          )}
          <CommandPrimitive.List
            id={listboxId}
            className="max-h-72 overflow-y-auto overflow-x-hidden p-1"
          >
            <CommandPrimitive.Empty className="py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </CommandPrimitive.Empty>
            {options.map((option) => {
              const selected = selectedValues.includes(option.value);
              return (
                <CommandPrimitive.Item
                  key={option.value}
                  value={option.label}
                  keywords={option.keywords ?? []}
                  disabled={option.disabled ?? false}
                  onSelect={() => handleSelect(option.value)}
                  className={cn(
                    'relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none',
                    'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
                    'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
                  )}
                >
                  {option.icon}
                  <span className="truncate">{option.label}</span>
                  {/* cmdk's Item defines its own onPointerMove for hover-highlighting, which wins
                      over any handler cloned onto the Item by a wrapping Radix Tooltip's asChild —
                      so the tooltip trigger has to live on this inner element instead of the row. */}
                  {option.description && (
                    <ComboboxOptionDescription description={option.description} />
                  )}
                  <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check
                      className={cn('h-4 w-4', selected ? 'opacity-100' : 'opacity-0')}
                    />
                  </span>
                </CommandPrimitive.Item>
              );
            })}
          </CommandPrimitive.List>
        </CommandPrimitive>
      </PopoverContent>
    </Popover>
  );
});
Combobox.displayName = 'Combobox';

export { Combobox };
