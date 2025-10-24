const React = require("react");

jest.mock("recharts", () => {
  const React = require("react");
  return {
    ResponsiveContainer: ({ children }) => React.createElement("div", { "data-testid": "responsive" }, children),
    LineChart: ({ children }) => React.createElement("div", { "data-testid": "linechart" }, children),
    XAxis: () => React.createElement("div", { "data-testid": "xaxis" }),
    YAxis: () => React.createElement("div", { "data-testid": "yaxis" }),
    Tooltip: () => React.createElement("div", { "data-testid": "tooltip" }),
    Line: () =>
      React.createElement(
        "svg",
        { "data-testid": "line-svg", viewBox: "0 0 10 10" },
        React.createElement("path", { d: "M0 0 L10 10" })
      ),
  };
});

jest.mock("../hooks/useFetchCrypto", () => ({
  useFetchCrypto: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
import CryptoChart from "../components/CryptoChart";
import { useFetchCrypto } from "../hooks/useFetchCrypto";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("CryptoChart component", () => {
  test("Muestra el titulo del grafico con el nombre de la moneda", () => {
    useFetchCrypto.mockReturnValue({
      data: { prices: [[1609459200000, 34000], [1609545600000, 35000]] },
      loading: false,
      error: null,
    });

    render(<CryptoChart coinId="bitcoin" days={7} />);
    const title = screen.getByText(/Precio de Bitcoin/i);
    expect(title).toBeInTheDocument();
  });

  test("muestra el gráfico de líneas (svg mock)", () => {
    useFetchCrypto.mockReturnValue({
      data: { prices: [[1609459200000, 34000], [1609545600000, 35000]] },
      loading: false,
      error: null,
    });

    render(<CryptoChart coinId="bitcoin" days={7} />);
    const svgElement = screen.getByTestId("line-svg");
    expect(svgElement).toBeInTheDocument();
  });

  test("renderiza el contenedor responsivo y elementos del gráfico", () => {
    useFetchCrypto.mockReturnValue({
      data: { prices: [[1609459200000, 34000], [1609545600000, 35000]] },
      loading: false,
      error: null,
    });

    render(<CryptoChart coinId="ethereum" days={14} />);
    expect(screen.getByTestId("responsive")).toBeInTheDocument();
    expect(screen.getByTestId("linechart")).toBeInTheDocument();
    expect(screen.getByTestId("xaxis")).toBeInTheDocument();
    expect(screen.getByTestId("yaxis")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  test("muestra el estado de carga", () => {
    useFetchCrypto.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<CryptoChart coinId="bitcoin" days={7} />);
    expect(screen.getByText(/Cargando datos.../i)).toBeInTheDocument();
  });

  test("muestra el mensaje de error cuando falla la petición", () => {
    useFetchCrypto.mockReturnValue({
      data: null,
      loading: false,
      error: "Error del servicio",
    });

    render(<CryptoChart coinId="bitcoin" days={7} />);
    expect(screen.getByText(/Error del servicio/i)).toBeInTheDocument();
  });
});