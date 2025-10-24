jest.mock("../services/moralisService", () => ({
  __esModule: true,
  getTrendingNFTs: jest.fn(() =>
    Promise.resolve([
      {
        thumbnail: "/img1.jpg",
        name: "NFT Uno",
        collection_title: "Colección A",
        floor_price: "0.5 ETH",
      },
      {
        thumbnail: "/img2.jpg",
        name: "NFT Dos",
        collection_title: "Colección B",
        floor_price: "1.2 ETH",
      },
    ])
  ),
}));

import { render, screen } from "@testing-library/react";
import NftGallery from "../components/NftGallery";

describe("NftGallery component", () => {
  test("muestra el titulo de NFTs en Tendencia", () => {
    render(<NftGallery />);
    const heading = screen.getByText(/NFTs en Tendencia/i);
    expect(heading).toBeInTheDocument();
  });

  test("muestra al menos una tarjeta NFTs (mocked service)", async () => {
    render(<NftGallery />);
    const cards = await screen.findAllByRole("img");
    expect(cards.length).toBeGreaterThan(0);
  });
});