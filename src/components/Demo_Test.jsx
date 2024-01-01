import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFetchSummaryMutation } from "../services/article";
import Demo from './Demo';

jest.mock("../services/article", () => ({
  useFetchSummaryMutation: jest.fn(),
}));

describe('Demo component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the input field correctly', () => {
    render(<Demo />);
    const input = screen.getByPlaceholderText('Paste the article online link');
    expect(input).toBeInTheDocument();
  });

  test('submitting the form with empty input does nothing', () => {
    render(<Demo />);
    const submitButton = screen.getByRole('button', { type: 'submit' });
    fireEvent.click(submitButton);
    expect(useFetchSummaryMutation).not.toHaveBeenCalled();
  });

  test('submitting the form with a valid URL calls the fetchSummary function', async () => {
    const fetchSummaryMock = jest.fn();
    useFetchSummaryMutation.mockReturnValue([fetchSummaryMock, {}]);
    render(<Demo />);
    const input = screen.getByPlaceholderText('Paste the article online link');
    const submitButton = screen.getByRole('button', { type: 'submit' });

    await userEvent.type(input, 'https://example.com');
    fireEvent.click(submitButton);

    expect(fetchSummaryMock).toHaveBeenCalledWith({ url: 'https://example.com', text: '', sentnum: 5 });
  });

  test('copying the URL calls navigator.clipboard.writeText and shows the copied icon', async () => {
    jest.spyOn(navigator.clipboard, 'writeText');
    render(<Demo />);
    const copyButton = screen.getByAltText('copy_icon');
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    await screen.findByAltText('tick_icon');
  });

  test('deleting a link removes it from the history', () => {
    render(<Demo />);
    const deleteButton = screen.getByAltText('delete_icon');
    fireEvent.click(deleteButton);
    expect(screen.queryByText('https://example.com')).not.toBeInTheDocument();
  });
});