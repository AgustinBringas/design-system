import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Combobox, type ComboboxOption } from './combobox';

const spells: ComboboxOption[] = [
  { value: 'fireball', label: 'Fireball', keywords: ['evocation', '3rd-level'] },
  {
    value: 'magic-missile',
    label: 'Magic Missile',
    keywords: ['evocation', '1st-level'],
  },
  { value: 'wish', label: 'Wish', disabled: true },
];

describe('Combobox', () => {
  it('renders the placeholder when nothing is selected', () => {
    render(<Combobox options={spells} placeholder="Select a spell" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Select a spell');
  });

  it('does not render options before the trigger is opened', () => {
    render(<Combobox options={spells} />);
    expect(screen.queryByText('Fireball')).not.toBeInTheDocument();
  });

  it('opens and shows options when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<Combobox options={spells} />);
    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Fireball' })).toBeInTheDocument(),
    );
    expect(screen.getByRole('option', { name: 'Magic Missile' })).toBeInTheDocument();
  });

  it('filters options as the user types', async () => {
    const user = userEvent.setup();
    render(<Combobox options={spells} searchPlaceholder="Search spells" />);
    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Fireball' })).toBeInTheDocument(),
    );
    await user.type(screen.getByPlaceholderText('Search spells'), 'fire');
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Fireball' })).toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: 'Magic Missile' }),
      ).not.toBeInTheDocument();
    });
  });

  it('shows the empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        options={spells}
        emptyText="Nothing here"
        searchPlaceholder="Search spells"
      />,
    );
    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Fireball' })).toBeInTheDocument(),
    );
    await user.type(screen.getByPlaceholderText('Search spells'), 'zzz');
    await waitFor(() => expect(screen.getByText('Nothing here')).toBeInTheDocument());
  });

  // ─── Single select ───────────────────────────────────────────────────────

  it('selects a single option, closes the popover, and shows the label', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox options={spells} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Fireball' })).toBeInTheDocument(),
    );
    await user.click(screen.getByRole('option', { name: 'Fireball' }));
    expect(onValueChange).toHaveBeenCalledWith('fireball');
    await waitFor(() => {
      expect(
        screen.queryByRole('option', { name: 'Magic Missile' }),
      ).not.toBeInTheDocument();
    });
  });

  it('reflects a controlled single value in the trigger', () => {
    render(<Combobox options={spells} value="fireball" />);
    expect(screen.getByRole('combobox')).toHaveTextContent('Fireball');
  });

  it('does not select a disabled option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox options={spells} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Wish' })).toBeInTheDocument(),
    );
    await user.click(screen.getByRole('option', { name: 'Wish' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  // ─── Multiple select ─────────────────────────────────────────────────────

  it('accumulates selections and keeps the popover open for type="multiple"', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox type="multiple" options={spells} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Fireball' })).toBeInTheDocument(),
    );
    await user.click(screen.getByRole('option', { name: 'Fireball' }));
    expect(onValueChange).toHaveBeenCalledWith(['fireball']);
    expect(screen.getByRole('option', { name: 'Magic Missile' })).toBeInTheDocument();
  });

  it('deselects an option already in the multiple value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Combobox
        type="multiple"
        options={spells}
        value={['fireball']}
        onValueChange={onValueChange}
      />,
    );
    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Fireball' })).toBeInTheDocument(),
    );
    await user.click(screen.getByRole('option', { name: 'Fireball' }));
    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it('joins selected labels in the trigger for type="multiple"', () => {
    render(
      <Combobox type="multiple" options={spells} value={['fireball', 'magic-missile']} />,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Fireball, Magic Missile');
  });

  // ─── Misc ────────────────────────────────────────────────────────────────

  it('is disabled when the disabled prop is set', () => {
    render(<Combobox options={spells} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('forwards ref to the trigger button', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Combobox options={spells} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('merges a custom className on the trigger', () => {
    render(<Combobox options={spells} className="my-combobox" />);
    expect(screen.getByRole('combobox').className).toMatch(/my-combobox/);
  });

  it('hides the internal search input when hideSearch is set', async () => {
    const user = userEvent.setup();
    render(<Combobox options={spells} hideSearch searchPlaceholder="Search spells" />);
    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Fireball' })).toBeInTheDocument(),
    );
    expect(screen.queryByPlaceholderText('Search spells')).not.toBeInTheDocument();
  });

  it('still selects options by click when hideSearch is set', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Combobox options={spells} hideSearch onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Fireball' })).toBeInTheDocument(),
    );
    await user.click(screen.getByRole('option', { name: 'Fireball' }));
    expect(onValueChange).toHaveBeenCalledWith('fireball');
  });

  // ─── Icon and description ───────────────────────────────────────────────

  it('renders an option icon and shows it in the trigger once selected', async () => {
    const user = userEvent.setup();
    const withIcon: ComboboxOption[] = [
      {
        value: 'fireball',
        label: 'Fireball',
        icon: <span data-testid="fireball-icon" />,
      },
    ];
    render(<Combobox options={withIcon} value="fireball" />);
    expect(screen.getByTestId('fireball-icon')).toBeInTheDocument();

    await user.click(screen.getByRole('combobox'));
    await waitFor(() => expect(screen.getAllByTestId('fireball-icon')).toHaveLength(2));
  });

  it('does not show the description text until an option with one is hovered', async () => {
    const user = userEvent.setup();
    const withDescription: ComboboxOption[] = [
      { value: 'fireball', label: 'Fireball', description: 'A bright streak flashes.' },
    ];
    render(<Combobox options={withDescription} />);
    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('option', { name: 'Fireball' });
    expect(screen.queryByText('A bright streak flashes.')).not.toBeInTheDocument();
  });

  it('shows the description text once the description icon is hovered', async () => {
    const user = userEvent.setup();
    const withDescription: ComboboxOption[] = [
      { value: 'fireball', label: 'Fireball', description: 'A bright streak flashes.' },
    ];
    render(<Combobox options={withDescription} />);
    await user.click(screen.getByRole('combobox'));
    const option = await screen.findByRole('option', { name: 'Fireball' });
    const icon = option.querySelector('[data-testid="combobox-option-description-icon"]');
    if (!icon) throw new Error('description icon not found');
    await user.hover(icon);
    await waitFor(
      () =>
        expect(screen.getByRole('tooltip')).toHaveTextContent('A bright streak flashes.'),
      { timeout: 2000 },
    );
  });

  it('renders the description as markdown, not raw asterisks', async () => {
    const user = userEvent.setup();
    const withDescription: ComboboxOption[] = [
      {
        value: 'fireball',
        label: 'Fireball',
        description: 'Make a **Ranged Spell Attack** against the target.',
      },
    ];
    render(<Combobox options={withDescription} />);
    await user.click(screen.getByRole('combobox'));
    const option = await screen.findByRole('option', { name: 'Fireball' });
    const icon = option.querySelector('[data-testid="combobox-option-description-icon"]');
    if (!icon) throw new Error('description icon not found');
    await user.hover(icon);
    await waitFor(
      () =>
        expect(screen.getByRole('tooltip')).toHaveTextContent(
          'Make a Ranged Spell Attack against the target.',
        ),
      { timeout: 2000 },
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.querySelector('strong')).toHaveTextContent('Ranged Spell Attack');
  });

  it('tapping the description icon on a touchscreen does not select the option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const withDescription: ComboboxOption[] = [
      { value: 'fireball', label: 'Fireball', description: 'A bright streak flashes.' },
    ];
    render(<Combobox options={withDescription} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    const option = await screen.findByRole('option', { name: 'Fireball' });
    const icon = option.querySelector('[data-testid="combobox-option-description-icon"]');
    if (!icon) throw new Error('description icon not found');

    // A real touchscreen tap fires pointerdown/pointerup with pointerType "touch" — Radix
    // Tooltip explicitly ignores those (hover isn't a touch concept) — followed by a
    // browser-synthesized click, which is what actually selects a cmdk option.
    fireEvent.pointerDown(icon, { pointerType: 'touch' });
    fireEvent.pointerUp(icon, { pointerType: 'touch' });
    fireEvent.click(icon);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('tapping the description icon shows the description instead of doing nothing', async () => {
    const user = userEvent.setup();
    const withDescription: ComboboxOption[] = [
      { value: 'fireball', label: 'Fireball', description: 'A bright streak flashes.' },
    ];
    render(<Combobox options={withDescription} />);
    await user.click(screen.getByRole('combobox'));
    const option = await screen.findByRole('option', { name: 'Fireball' });
    const icon = option.querySelector('[data-testid="combobox-option-description-icon"]');
    if (!icon) throw new Error('description icon not found');

    fireEvent.pointerDown(icon, { pointerType: 'touch' });
    fireEvent.pointerUp(icon, { pointerType: 'touch' });
    fireEvent.click(icon);

    expect(screen.getByRole('tooltip')).toHaveTextContent('A bright streak flashes.');
  });

  it('shows a help icon on options with a description, and not on those without', async () => {
    const user = userEvent.setup();
    const mixed: ComboboxOption[] = [
      { value: 'fireball', label: 'Fireball', description: 'A bright streak flashes.' },
      { value: 'wish', label: 'Wish' },
    ];
    render(<Combobox options={mixed} />);
    await user.click(screen.getByRole('combobox'));
    const fireballOption = await screen.findByRole('option', { name: 'Fireball' });
    const wishOption = screen.getByRole('option', { name: 'Wish' });
    expect(
      fireballOption.querySelector('[data-testid="combobox-option-description-icon"]'),
    ).toBeInTheDocument();
    expect(
      wishOption.querySelector('[data-testid="combobox-option-description-icon"]'),
    ).not.toBeInTheDocument();
  });
});
