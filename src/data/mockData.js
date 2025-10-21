export const mockGames = [
    {
      id: 1,
      title: "Cyberpunk 2077",
      genre: "RPG",
      price: 59.99,
      discountedPrice: 39.99,
      discount: 33,
      image: "https://via.placeholder.com/300x400/333/fff?text=Cyberpunk+2077",
      platforms: ["PC", "PS5", "XBOX"],
      rating: 4.5,
      description: "An immersive open-world adventure set in a dystopian future. Experience breathtaking visuals, deep RPG mechanics, and an engaging story that will keep you playing for hours.",
      developer: "CD Projekt Red",
      publisher: "CD Projekt",
      releaseDate: "December 10, 2020",
      features: ["Open World", "RPG", "Single Player", "Character Customization"],
      systemRequirements: {
        minimum: {
          os: "Windows 10",
          processor: "Intel Core i5-3570K or AMD FX-8310",
          memory: "8 GB RAM",
          graphics: "NVIDIA GeForce GTX 970 or AMD Radeon RX 470",
          storage: "70 GB"
        },
        recommended: {
          os: "Windows 10",
          processor: "Intel Core i7-4790 or AMD Ryzen 3 3200G",
          memory: "12 GB RAM",
          graphics: "NVIDIA GeForce GTX 1060 or AMD Radeon RX 590",
          storage: "70 GB SSD"
        }
      },
      screenshots: [
        "https://via.placeholder.com/800x450/333/fff?text=Cyberpunk+Screenshot+1",
        "https://via.placeholder.com/800x450/333/fff?text=Cyberpunk+Screenshot+2",
        "https://via.placeholder.com/800x450/333/fff?text=Cyberpunk+Screenshot+3",
        "https://via.placeholder.com/800x450/333/fff?text=Cyberpunk+Screenshot+4"
      ]
    },
    {
      id: 2,
      title: "The Witcher 3: Wild Hunt",
      genre: "RPG",
      price: 29.99,
      image: "https://via.placeholder.com/300x400/333/fff?text=The+Witcher+3",
      platforms: ["PC", "PS4", "XBOX", "Switch"],
      rating: 5.0,
      description: "A story-driven, open world adventure set in a dark fantasy universe. As a monster hunter, you'll embark on an epic journey through war-torn kingdoms.",
      developer: "CD Projekt Red",
      publisher: "CD Projekt",
      releaseDate: "May 19, 2015",
      features: ["Open World", "RPG", "Single Player", "Story Rich", "Fantasy"],
      systemRequirements: {
        minimum: {
          os: "Windows 7/8/8.1/10 (64-bit)",
          processor: "Intel CPU Core i5-2500K 3.3GHz / AMD CPU Phenom II X4 940",
          memory: "6 GB RAM",
          graphics: "Nvidia GPU GeForce GTX 660 / AMD GPU Radeon HD 7870",
          storage: "35 GB"
        },
        recommended: {
          os: "Windows 7/8/8.1/10 (64-bit)",
          processor: "Intel CPU Core i7 3770 3.4 GHz / AMD CPU AMD FX-8350 4 GHz",
          memory: "8 GB RAM",
          graphics: "Nvidia GPU GeForce GTX 770 / AMD GPU Radeon R9 290",
          storage: "35 GB"
        }
      },
      screenshots: [
        "https://via.placeholder.com/800x450/333/fff?text=Witcher+Screenshot+1",
        "https://via.placeholder.com/800x450/333/fff?text=Witcher+Screenshot+2",
        "https://via.placeholder.com/800x450/333/fff?text=Witcher+Screenshot+3",
        "https://via.placeholder.com/800x450/333/fff?text=Witcher+Screenshot+4"
      ]
    },
    {
      id: 3,
      title: "FIFA 24",
      genre: "Sports",
      price: 69.99,
      discountedPrice: 49.99,
      discount: 28,
      image: "https://via.placeholder.com/300x400/333/fff?text=FIFA+24",
      platforms: ["PS5", "XBOX"],
      rating: 4.0,
      description: "The latest installment in the world's most popular football simulation. Experience realistic gameplay, updated teams, and enhanced graphics.",
      developer: "EA Sports",
      publisher: "Electronic Arts",
      releaseDate: "September 29, 2023",
      features: ["Sports", "Multiplayer", "Football", "Competitive", "Simulation"],
      systemRequirements: {
        minimum: {
          os: "Windows 10 64-bit",
          processor: "Intel Core i5-3550 @ 3.40GHz or AMD FX 8150 @ 3.6GHz",
          memory: "8 GB RAM",
          graphics: "NVIDIA GeForce GTX 670 or AMD Radeon R9 270X",
          storage: "50 GB"
        },
        recommended: {
          os: "Windows 10 64-bit",
          processor: "Intel Core i7-6700 @ 3.40GHz or AMD Ryzen 5 1600",
          memory: "12 GB RAM",
          graphics: "NVIDIA GeForce GTX 1060 or AMD Radeon RX 580",
          storage: "50 GB SSD"
        }
      },
      screenshots: [
        "https://via.placeholder.com/800x450/333/fff?text=FIFA+Screenshot+1",
        "https://via.placeholder.com/800x450/333/fff?text=FIFA+Screenshot+2",
        "https://via.placeholder.com/800x450/333/fff?text=FIFA+Screenshot+3",
        "https://via.placeholder.com/800x450/333/fff?text=FIFA+Screenshot+4"
      ]
    },
    {
      id: 4,
      title: "Call of Duty: Modern Warfare",
      genre: "FPS",
      price: 59.99,
      image: "https://via.placeholder.com/300x400/333/fff?text=Call+of+Duty",
      platforms: ["PC", "PS5", "XBOX"],
      rating: 4.2,
      description: "Experience classic Call of Duty combat with modern graphics and gameplay. Engage in intense multiplayer battles and a gripping single-player campaign.",
      developer: "Infinity Ward",
      publisher: "Activision",
      releaseDate: "October 25, 2019",
      features: ["FPS", "Multiplayer", "Single Player", "Action", "Shooter"],
      systemRequirements: {
        minimum: {
          os: "Windows 7 64-bit (SP1) or Windows 10 64-bit",
          processor: "Intel Core i3-4340 or AMD FX-6300",
          memory: "8 GB RAM",
          graphics: "NVIDIA GeForce GTX 670 / GeForce GTX 1650 or Radeon HD 7950",
          storage: "175 GB"
        },
        recommended: {
          os: "Windows 10 64-bit",
          processor: "Intel Core i5-2500K or AMD Ryzen R5 1600X",
          memory: "12 GB RAM",
          graphics: "NVIDIA GeForce GTX 970 / GTX 1660 or Radeon R9 390 / RX 580",
          storage: "175 GB SSD"
        }
      },
      screenshots: [
        "https://via.placeholder.com/800x450/333/fff?text=COD+Screenshot+1",
        "https://via.placeholder.com/800x450/333/fff?text=COD+Screenshot+2",
        "https://via.placeholder.com/800x450/333/fff?text=COD+Screenshot+3",
        "https://via.placeholder.com/800x450/333/fff?text=COD+Screenshot+4"
      ]
    },
    {
      id: 5,
      title: "Minecraft",
      genre: "Sandbox",
      price: 26.95,
      image: "https://via.placeholder.com/300x400/333/fff?text=Minecraft",
      platforms: ["PC", "PS4", "XBOX", "Switch", "Mobile"],
      rating: 4.8,
      description: "A sandbox adventure game where you can build, explore, and survive in a blocky, procedurally-generated 3D world with infinite terrain.",
      developer: "Mojang Studios",
      publisher: "Mojang Studios",
      releaseDate: "November 18, 2011",
      features: ["Sandbox", "Building", "Survival", "Multiplayer", "Open World"],
      systemRequirements: {
        minimum: {
          os: "Windows 7 and up",
          processor: "Intel Core i3-3210 or AMD A8-7600 APU or equivalent",
          memory: "4 GB RAM",
          graphics: "Intel HD Graphics 4000 or AMD Radeon R5 series",
          storage: "1 GB"
        },
        recommended: {
          os: "Windows 10",
          processor: "Intel Core i5-4690 or AMD A10-7800 or equivalent",
          memory: "8 GB RAM",
          graphics: "GeForce 700 Series or AMD Radeon Rx 200 Series",
          storage: "4 GB"
        }
      },
      screenshots: [
        "https://via.placeholder.com/800x450/333/fff?text=Minecraft+Screenshot+1",
        "https://via.placeholder.com/800x450/333/fff?text=Minecraft+Screenshot+2",
        "https://via.placeholder.com/800x450/333/fff?text=Minecraft+Screenshot+3",
        "https://via.placeholder.com/800x450/333/fff?text=Minecraft+Screenshot+4"
      ]
    },
    {
      id: 6,
      title: "Grand Theft Auto V",
      genre: "Action",
      price: 29.99,
      discountedPrice: 19.99,
      discount: 33,
      image: "https://via.placeholder.com/300x400/333/fff?text=GTA+V",
      platforms: ["PC", "PS5", "XBOX"],
      rating: 4.7,
      description: "Explore the stunning world of Los Santos and Blaine County in the ultimate Grand Theft Auto V experience, featuring a massive open world and thrilling online multiplayer.",
      developer: "Rockstar North",
      publisher: "Rockstar Games",
      releaseDate: "April 14, 2015",
      features: ["Open World", "Action", "Multiplayer", "Single Player", "Adventure"],
      systemRequirements: {
        minimum: {
          os: "Windows 8.1 64 Bit, Windows 8 64 Bit, Windows 7 64 Bit Service Pack 1",
          processor: "Intel Core 2 Quad CPU Q6600 @ 2.40GHz (4 CPUs) / AMD Phenom 9850 Quad-Core Processor (4 CPUs) @ 2.5GHz",
          memory: "4 GB RAM",
          graphics: "NVIDIA 9800 GT 1GB / AMD HD 4870 1GB (DX 10, 10.1, 11)",
          storage: "72 GB"
        },
        recommended: {
          os: "Windows 8.1 64 Bit, Windows 8 64 Bit, Windows 7 64 Bit Service Pack 1",
          processor: "Intel Core i5 3470 @ 3.2GHZ (4 CPUs) / AMD X8 FX-8350 @ 4GHZ (8 CPUs)",
          memory: "8 GB RAM",
          graphics: "NVIDIA GTX 660 2GB / AMD HD7870 2GB",
          storage: "72 GB SSD"
        }
      },
      screenshots: [
        "https://via.placeholder.com/800x450/333/fff?text=GTA+Screenshot+1",
        "https://via.placeholder.com/800x450/333/fff?text=GTA+Screenshot+2",
        "https://via.placeholder.com/800x450/333/fff?text=GTA+Screenshot+3",
        "https://via.placeholder.com/800x450/333/fff?text=GTA+Screenshot+4"
      ]
    }
  ];