import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";

jest.mock("../components/Navbar", () => ({ __esModule: true, default: () => <div data-testid="navbar" /> }));

jest.mock("../components/FilterBar", () => ({
  __esModule: true,
  default: ({ selected, onChange }) => (
    <div data-testid="filterbar">
      <span data-testid="selected">{selected}</span>
      <button data-testid="filter-change" onClick={() => onChange("ethereum")}>
        change
      </button>
    </div>
  ),
}));

jest.mock("../components/CryptoChart", () => ({
  __esModule: true,
  default: ({ coinId }) => <div data-testid="crypto-chart" data-coinid={coinId} />,
}));

jest.mock("../components/MarketChart", () => ({ __esModule: true, default: () => <div data-testid="market-chart" /> }));
jest.mock("../components/NftGallery", () => ({ __esModule: true, default: () => <div data-testid="nft-gallery" /> }));
jest.mock("../components/RadialPrice", () => ({ __esModule: true, default: () => <div data-testid="radial-price" /> }));
jest.mock("../components/PieChartSales", () => ({ __esModule: true, default: () => <div data-testid="pie-sales" /> }));
jest.mock("../components/SearchByName", () => ({ __esModule: true, default: () => <div data-testid="search-by-name" /> }));

describe("Dashboard component (tests minimales y aislados)", () => {
  test("renderiza la estructura principal y componentes clave", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("nft-gallery")).toBeInTheDocument();
    expect(screen.getByTestId("market-chart")).toBeInTheDocument();
    expect(screen.getByTestId("radial-price")).toBeInTheDocument();
    expect(screen.getByTestId("pie-sales")).toBeInTheDocument();
    expect(screen.getByTestId("search-by-name")).toBeInTheDocument();
  });

  test("CryptoChart recibe el coinId por defecto 'bitcoin'", () => {
    render(<Dashboard />);
    const crypto = screen.getByTestId("crypto-chart");
    expect(crypto.getAttribute("data-coinid")).toBe("bitcoin");
  });

  test("cuando FilterBar dispara onChange, cambia el coinId que recibe CryptoChart", () => {
    render(<Dashboard />);
    const changeBtn = screen.getByTestId("filter-change");
    const crypto = () => screen.getByTestId("crypto-chart");

    // estado inicial
    expect(crypto().getAttribute("data-coinid")).toBe("bitcoin");

    // simular cambio desde el FilterBar mock
    fireEvent.click(changeBtn);

    // nuevo estado reflejado en el mock de CryptoChart
    expect(crypto().getAttribute("data-coinid")).toBe("ethereum");
  });
});