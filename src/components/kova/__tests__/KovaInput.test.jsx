import { render, screen, fireEvent } from '@testing-library/react';
import KovaInput from '../KovaInput';

describe('KovaInput', () => {
  it('se rend sans erreur', () => {
    render(<KovaInput />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applique la classe kova-field__input sur l\'input', () => {
    render(<KovaInput />);
    expect(screen.getByRole('textbox')).toHaveClass('kova-field__input');
  });

  it('est enveloppé dans un <label> avec la classe kova-field', () => {
    const { container } = render(<KovaInput />);
    expect(container.querySelector('label.kova-field')).toBeInTheDocument();
  });

  it('affiche le label si fourni', () => {
    render(<KovaInput label="Votre nom" />);
    expect(screen.getByText('Votre nom')).toBeInTheDocument();
  });

  it("n'affiche pas de label span si label absent", () => {
    const { container } = render(<KovaInput />);
    expect(container.querySelector('.kova-field__label')).not.toBeInTheDocument();
  });

  it('affiche le hint si fourni', () => {
    render(<KovaInput hint="Aide saisie" />);
    expect(screen.getByText('Aide saisie')).toBeInTheDocument();
  });

  it("n'affiche pas de hint si absent", () => {
    const { container } = render(<KovaInput />);
    expect(container.querySelector('.kova-field__helper')).not.toBeInTheDocument();
  });

  it('transmet le placeholder à l\'input', () => {
    render(<KovaInput placeholder="votre@email.fr" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'votre@email.fr');
  });

  it('transmet le type à l\'input', () => {
    const { container } = render(<KovaInput type="email" />);
    expect(container.querySelector('input')).toHaveAttribute('type', 'email');
  });

  it('transmet la valeur et onChange', () => {
    const onChange = jest.fn();
    render(<KovaInput value="test" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test');
    fireEvent.change(input, { target: { value: 'nouveau' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
