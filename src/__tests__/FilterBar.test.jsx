import { render, screen, fireEvent } from "@testing-library/react";
import FilterBar from "../components/FilterBar";

describe("FilterBar component", () => {
  test("muestra el select con el valor por defecto", () => {
    render(<FilterBar selected="bitcoin" onChange={() => {}} />);
    const select = screen.getByRole("combobox");
    expect(select.value).toBe("bitcoin");
  });

  test("cambia el valor del select cuando activa el onChange", () => {
    const handleChange = jest.fn();
    render(<FilterBar selected="bitcoin" onChange={handleChange} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "ethereum" } });
    expect(handleChange).toHaveBeenCalledWith("ethereum");
  });
});