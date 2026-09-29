import { Reservation } from '../types';

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    "id": "RES-2026-1156",
    "commercialId": "user-1787557525876",
    "commercialName": "K2EM CHERY Charguia 1",
    "agency": "Chery Agence Charguia 1",
    "carId": "car-1785513071800",
    "carName": "Chery Tiggo 9 PHEV (Black CM)",
    "colorChosen": {
      "id": "col-1786981421374",
      "name": "Black CM",
      "hexCode": "#030303"
    },
    "vehicles": [
      {
        "id": "v-1790606609575",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-1786981421374",
          "name": "Black CM",
          "hexCode": "#030303"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900,
        "requiredDepositTND": 50000
      }
    ],
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "Sté Audit And Corprate Advisor",
        "matriculeFiscale": "1510075R",
        "ville": "Tunis",
        "telephone": "98616661",
        "email": "",
        "adresse": "",
        "registreCommerce": ""
      }
    },
    "documents": [
      {
        "id": "doc-1790606777760-73xr",
        "name": "rne.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.30 MB",
        "uploadedAt": "2026-09-28 14:46"
      },
      {
        "id": "doc-1790606794732-2ged",
        "name": "BC Audit.pdf",
        "category": "bon_commande",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.25 MB",
        "uploadedAt": "2026-09-28 14:46"
      }
    ],
    "priceTND": 129900,
    "registrationFeeTND": 0,
    "depositPaidTND": 0,
    "paymentMethod": "Leasing",
    "status": "Confirmée",
    "createdAt": "2026-09-28T14:46:48.272Z",
    "updatedAt": "2026-09-28T14:46:48.272Z",
    "etaDate": "2026-09-28",
    "expectedDeliveryDate": "2026-10-28",
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis."
  },
  {
    "id": "RES-2026-1155",
    "commercialId": "user-1787557241636",
    "commercialName": "DISTRICARS Sfax",
    "agency": "Chery Agence Sfax",
    "carId": "car-1785753150277",
    "carName": "Chery I03 4X2 (Black BL)",
    "colorChosen": {
      "id": "col-1-1785753150277",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "vehicles": [
      {
        "id": "v-1790605976305",
        "carId": "car-1785753150277",
        "carName": "Chery I03 4X2",
        "colorChosen": {
          "id": "col-1-1785753150277",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 76900,
        "totalPriceTND": 76900,
        "requiredDepositTND": 20000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "MAALEJ",
        "prenom": "MOHAMED AYMAN",
        "cin": "08167110",
        "ville": "Sfax",
        "telephone": "97125500",
        "email": "",
        "adresse": "SFAX"
      }
    },
    "documents": [
      {
        "id": "doc-1790606030484-xgz2",
        "name": "I03 4X2 NOIR MOHAMED AYMAN MAALEJ.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.44 MB",
        "uploadedAt": "2026-09-28 14:33"
      }
    ],
    "priceTND": 76900,
    "registrationFeeTND": 0,
    "depositPaidTND": 0,
    "paymentMethod": "Leasing",
    "status": "Confirmée",
    "createdAt": "2026-09-28T14:34:32.478Z",
    "updatedAt": "2026-09-28T14:34:51.485Z",
    "etaDate": "2026-09-28",
    "expectedDeliveryDate": "2026-10-28",
    "notes": "BON DE COMMANDE UBCI  | ⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés."
  },
  {
    "id": "RES-2026-1154",
    "commercialId": "user-1787557462429",
    "commercialName": "TAGOURTI CHERY Sousse",
    "agency": "Chery Agence Sousse",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Tech Gray GX)",
    "colorChosen": {
      "id": "col-3-1785753278797",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "vehicles": [
      {
        "id": "v-1790605858114",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-3-1785753278797",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900,
        "requiredDepositTND": 30000
      }
    ],
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE ABCPRO ",
        "matriculeFiscale": "1823948/FBM/000",
        "ville": "Sousse",
        "telephone": "50672674",
        "email": "",
        "adresse": "",
        "registreCommerce": ""
      }
    },
    "documents": [
      {
        "id": "doc-1790605984969-sm7l",
        "name": "NOTIF D ACCORD Sté ABC PRO (1).pdf",
        "category": "accord_bancaire",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.27 MB",
        "uploadedAt": "2026-09-28 14:33"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 20000,
    "paymentMethod": "Dossier Bancaire",
    "status": "Confirmée",
    "createdAt": "2026-09-28T14:33:27.188Z",
    "updatedAt": "2026-09-28T14:35:33.022Z",
    "etaDate": "2026-09-28",
    "expectedDeliveryDate": "2026-10-28",
    "notes": "⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés."
  },
  {
    "id": "RES-2026-1153",
    "commercialId": "user-1787557241636",
    "commercialName": "DISTRICARS Sfax",
    "agency": "Chery Agence Sfax",
    "carId": "car-1787908920743",
    "carName": "Chery Himla 4X4 BVA (Silver Gray GR)",
    "colorChosen": {
      "id": "col-2-1787908920743",
      "name": "Silver Gray GR",
      "hexCode": "#475569"
    },
    "vehicles": [
      {
        "id": "v-1790600657476",
        "carId": "car-1787908920743",
        "carName": "Chery Himla 4X4 BVA",
        "colorChosen": {
          "id": "col-2-1787908920743",
          "name": "Silver Gray GR",
          "hexCode": "#475569"
        },
        "quantity": 1,
        "unitPriceTND": 119900,
        "totalPriceTND": 119900,
        "requiredDepositTND": 20000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "NAIFER",
        "prenom": "FAIEZ",
        "cin": "01341203",
        "ville": "Sfax",
        "telephone": "98247319",
        "email": "",
        "adresse": "SFAX"
      }
    },
    "documents": [
      {
        "id": "doc-1790600737035-r648",
        "name": "VERSEMENT 20 MILLE DT HIMLA 4X4 AT NAIFER FAIEZ.pdf",
        "category": "cin_verso",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.35 MB",
        "uploadedAt": "2026-09-28 13:05"
      }
    ],
    "priceTND": 119900,
    "registrationFeeTND": 0,
    "depositPaidTND": 20000,
    "paymentMethod": "Espèces",
    "status": "Confirmée",
    "createdAt": "2026-09-28T13:06:39.149Z",
    "updatedAt": "2026-09-28T13:07:51.163Z",
    "etaDate": "2026-09-28",
    "expectedDeliveryDate": "2026-10-28",
    "notes": "NOUS VOUS COMMUNIQUONS LE RESTE DU MONTANT DANS UNE SEMAINE "
  },
  {
    "id": "RES-2026-1152",
    "commercialId": "user-1787557462429",
    "commercialName": "TAGOURTI CHERY Sousse",
    "agency": "Chery Agence Sousse",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Tech Gray GX)",
    "colorChosen": {
      "id": "col-3-1785753278797",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "vehicles": [
      {
        "id": "v-1790600648188",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-3-1785753278797",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900,
        "requiredDepositTND": 30000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "BACCAR ",
        "prenom": "MOHAMED",
        "cin": "04160163",
        "ville": "Sousse",
        "telephone": "98264910",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [
      {
        "id": "doc-1790600697377-l8on",
        "name": "IMG_20260928_0003.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.15 MB",
        "uploadedAt": "2026-09-28 13:04"
      },
      {
        "id": "doc-1790600715193-bamh",
        "name": "IMG_20260928_0004.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.12 MB",
        "uploadedAt": "2026-09-28 13:05"
      },
      {
        "id": "doc-1790600755251-nenm",
        "name": "IMG_20260928_0005.pdf",
        "category": "virement_bancaire",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.22 MB",
        "uploadedAt": "2026-09-28 13:05"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 30000,
    "paymentMethod": "Virement Bancaire",
    "status": "En attente",
    "createdAt": "2026-09-28T13:06:04.040Z",
    "updatedAt": "2026-09-28T13:06:04.041Z",
    "etaDate": "2026-09-28",
    "expectedDeliveryDate": "2026-10-28",
    "notes": ""
  },
  {
    "id": "RES-2026-1151",
    "commercialId": "user-1787557344213",
    "commercialName": "GODDI CHERY Nabeul",
    "agency": "Chery Agence Nabeul",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
    "colorChosen": {
      "id": "col-2-1785753278797",
      "name": "Phantom Gray GV",
      "hexCode": "#939AA5"
    },
    "vehicles": [
      {
        "id": "v-1790589944085",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-2-1785753278797",
          "name": "Phantom Gray GV",
          "hexCode": "#939AA5"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900,
        "requiredDepositTND": 30000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "HANCHANI",
        "prenom": "SONIA",
        "cin": "11381274",
        "ville": "Bizerte",
        "telephone": "27507164",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [
      {
        "id": "doc-1790590123586-w7u0",
        "name": "CIN.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.07 MB",
        "uploadedAt": "2026-09-28 10:08"
      },
      {
        "id": "doc-1790590232562-h1qv",
        "name": "accord.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.48 MB",
        "uploadedAt": "2026-09-28 10:10"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 0,
    "paymentMethod": "Leasing",
    "status": "En attente",
    "createdAt": "2026-09-28T10:10:42.050Z",
    "updatedAt": "2026-09-28T10:10:42.050Z",
    "etaDate": "2026-09-28",
    "expectedDeliveryDate": "2026-10-28",
    "notes": "⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés."
  },
  {
    "id": "RES-2026-1150",
    "commercialId": "user-1787557344213",
    "commercialName": "GODDI CHERY Nabeul",
    "agency": "Chery Agence Nabeul",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
    "colorChosen": {
      "name": "Phantom Gray GV",
      "id": "col-2-1785753278797",
      "hexCode": "#939AA5"
    },
    "vehicles": [
      {
        "totalPriceTND": 88900,
        "requiredDepositTND": 30000,
        "colorChosen": {
          "id": "col-2-1785753278797",
          "name": "Phantom Gray GV",
          "hexCode": "#939AA5"
        },
        "id": "v-1790586367964",
        "carName": "Chery Tiggo 7 PHEV",
        "unitPriceTND": 88900,
        "carId": "car-1785753278797",
        "quantity": 1
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "adresse": "",
        "prenom": "FATHI",
        "nom": "SALEM",
        "telephone": "25299057",
        "email": "",
        "ville": "Tunis",
        "cin": "01173269"
      }
    },
    "documents": [
      {
        "fileType": "application/pdf",
        "name": "CIN.pdf",
        "id": "doc-1790586924632-j9fq",
        "uploadedAt": "2026-09-28 09:15",
        "category": "cin_recto",
        "sizeFormatted": "0.09 MB",
        "dataUrl": ""
      },
      {
        "name": "CHEQUE.pdf",
        "uploadedAt": "2026-09-28 09:15",
        "dataUrl": "",
        "fileType": "application/pdf",
        "category": "quittance_acompte",
        "id": "doc-1790586956643-opgm",
        "sizeFormatted": "0.11 MB"
      },
      {
        "dataUrl": "",
        "uploadedAt": "2026-09-28 09:16",
        "category": "quittance_acompte",
        "fileType": "application/pdf",
        "name": "DUR.pdf",
        "id": "doc-1790586968417-kt2e",
        "sizeFormatted": "0.14 MB"
      },
      {
        "id": "doc-1790587028846-pkpj",
        "dataUrl": "/uploads/1790587028742_BCII.pdf",
        "fileType": "application/pdf",
        "name": "BCII.pdf",
        "category": "cin_recto",
        "uploadedAt": "2026-09-28 09:17",
        "sizeFormatted": "0.08 MB"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 30000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-28T09:16:14.467Z",
    "updatedAt": "2026-09-28T09:48:57.568Z",
    "etaDate": "2026-09-28",
    "expectedDeliveryDate": "2026-10-28",
    "notes": ""
  },
  {
    "id": "RES-2026-1149",
    "commercialId": "comm-moez",
    "commercialName": "Moez Ben Naser",
    "agency": "Siege STA",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
    "colorChosen": {
      "hexCode": "#727783",
      "id": "col-RES-2026-1149",
      "name": "Phantom Gray GV"
    },
    "vehicles": [
      {
        "quantity": 1,
        "id": "veh-RES-2026-1149-0",
        "totalPriceTND": 88900,
        "colorChosen": {
          "hexCode": "#727783",
          "name": "Phantom Gray GV",
          "id": "col-RES-2026-1149"
        },
        "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
        "unitPriceTND": 88900,
        "carId": "car-1785753278797"
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "telephone": "58591223",
        "adresse": "",
        "nom": "ALI BEN SLIMEN",
        "ville": "Tunis",
        "email": "",
        "cin": "",
        "prenom": "MOHAMED"
      }
    },
    "documents": [
      {
        "id": "doc-1790585727720-h4pz",
        "category": "cin_recto",
        "name": "IMG_3444.jpeg",
        "sizeFormatted": "2.81 MB",
        "uploadedAt": "2026-09-28 08:55",
        "dataUrl": "",
        "fileType": "image/jpeg"
      },
      {
        "uploadedAt": "2026-09-28 08:55",
        "fileType": "image/jpeg",
        "name": "IMG_3445.jpeg",
        "id": "doc-1790585733796-64ib",
        "category": "cin_verso",
        "dataUrl": "",
        "sizeFormatted": "2.74 MB"
      },
      {
        "sizeFormatted": "2.89 MB",
        "category": "quittance_acompte",
        "id": "doc-1790585740982-46jp",
        "uploadedAt": "2026-09-28 08:55",
        "name": "IMG_3446.jpeg",
        "dataUrl": "",
        "fileType": "image/jpeg"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 20000,
    "paymentMethod": "Chèque Certifié",
    "status": "En attente",
    "createdAt": "2026-09-28T08:55:43.780Z",
    "updatedAt": "2026-09-28T08:55:43.780Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1149)",
    "etaDate": "2026-09-28",
    "expectedDeliveryDate": "2026-10-28"
  },
  {
    "id": "RES-2026-1148",
    "commercialId": "user-1787557525876",
    "commercialName": "K2EM CHERY Charguia 1",
    "agency": "Chery Agence Charguia 1",
    "carId": "car-1785753208837",
    "carName": "Chery I03 4X4 (Gray GY)",
    "colorChosen": {
      "id": "col-1786454499484",
      "hexCode": "#626a68",
      "name": "Gray GY"
    },
    "vehicles": [
      {
        "quantity": 1,
        "carName": "Chery I03 4X4",
        "unitPriceTND": 84900,
        "requiredDepositTND": 20000,
        "id": "v-1790584504800",
        "carId": "car-1785753208837",
        "colorChosen": {
          "name": "Gray GY",
          "id": "col-1786454499484",
          "hexCode": "#626a68"
        },
        "totalPriceTND": 84900
      }
    ],
    "client": {
      "societe": {
        "registreCommerce": "",
        "adresse": "",
        "telephone": "98749940",
        "matriculeFiscale": "01002458",
        "ville": "Tunis",
        "raisonSociale": "Sté IGPD",
        "email": ""
      },
      "type": "societe"
    },
    "documents": [
      {
        "id": "doc-1790584571747-7ucw",
        "name": "RNE IGPD.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.30 MB",
        "uploadedAt": "2026-09-28 08:36"
      },
      {
        "id": "doc-1790584717780-px06",
        "name": "Rese IGPD.pdf",
        "category": "quittance_acompte",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.10 MB",
        "uploadedAt": "2026-09-28 08:38"
      }
    ],
    "priceTND": 84900,
    "registrationFeeTND": 0,
    "depositPaidTND": 20000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-28T08:40:20.436Z",
    "updatedAt": "2026-09-28T10:04:16.243Z",
    "etaDate": "2026-09-28",
    "expectedDeliveryDate": "2026-10-28",
    "notes": ""
  },
  {
    "id": "RES-2026-1147",
    "registrationFeeTND": 0,
    "priceTND": 119900,
    "carName": "Chery Himla 4X4 BVA (Black CH)",
    "expectedDeliveryDate": "2026-10-28",
    "status": "Confirmée",
    "carId": "car-1787908920743",
    "updatedAt": "2026-09-28T08:26:34.442Z",
    "depositPaidTND": 20000,
    "etaDate": "2026-09-28",
    "paymentMethod": "Chèque Certifié",
    "notes": "",
    "createdAt": "2026-09-28T08:25:50.232Z",
    "commercialId": "comm-marwa",
    "commercialName": "Marwa Frikha",
    "agency": "Siege STA",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE MN ALLIANCE",
        "telephone": "94006128",
        "matriculeFiscale": "031041FPM",
        "email": "",
        "ville": "Tunis",
        "registreCommerce": "",
        "adresse": ""
      }
    },
    "colorChosen": {
      "id": "col-3-1787908920743",
      "hexCode": "#0A0A0A",
      "name": "Black CH"
    },
    "vehicles": [
      {
        "carName": "Chery Himla 4X4 BVA",
        "quantity": 1,
        "carId": "car-1787908920743",
        "totalPriceTND": 119900,
        "unitPriceTND": 119900,
        "id": "v-1790582158580",
        "colorChosen": {
          "name": "Black CH",
          "id": "col-3-1787908920743",
          "hexCode": "#0A0A0A"
        },
        "requiredDepositTND": 20000
      }
    ],
    "documents": [
      {
        "sizeFormatted": "2.23 MB",
        "uploadedAt": "2026-09-28 08:07",
        "id": "doc-1790582854051-j5sp",
        "name": "17905828053684349361157918895811.jpg",
        "category": "virement_bancaire",
        "fileType": "image/jpeg",
        "dataUrl": ""
      },
      {
        "uploadedAt": "2026-09-28 08:25",
        "id": "doc-1790583944725-5dvd",
        "category": "registre_commerce",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "2.67 MB",
        "name": "1790583934328643276953632107367.jpg"
      }
    ]
  },
  {
    "notes": "",
    "createdAt": "2026-09-26T10:38:30.810Z",
    "registrationFeeTND": 0,
    "expectedDeliveryDate": "2026-10-26",
    "agency": "Siege STA",
    "colorChosen": {
      "name": "Black CL",
      "hexCode": "#050505",
      "id": "col-1786454139529"
    },
    "priceTND": 88900,
    "updatedAt": "2026-09-26T10:38:30.810Z",
    "id": "RES-2026-1146",
    "etaDate": "2026-09-26",
    "status": "En attente",
    "commercialId": "comm-moez",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "carId": "car-1785753278797",
    "documents": [
      {
        "uploadedAt": "2026-09-26 10:37",
        "fileType": "image/jpeg",
        "name": "IMG_3435.jpeg",
        "dataUrl": "",
        "id": "doc-1790419067681-bl79",
        "sizeFormatted": "2.76 MB",
        "category": "cin_recto"
      },
      {
        "dataUrl": "",
        "category": "cin_verso",
        "sizeFormatted": "2.71 MB",
        "uploadedAt": "2026-09-26 10:37",
        "fileType": "image/jpeg",
        "id": "doc-1790419076897-qmo6",
        "name": "IMG_3436.jpeg"
      },
      {
        "fileType": "image/jpeg",
        "dataUrl": "",
        "name": "IMG_3434.jpeg",
        "id": "doc-1790419092201-li2r",
        "uploadedAt": "2026-09-26 10:38",
        "sizeFormatted": "2.80 MB",
        "category": "quittance_acompte"
      },
      {
        "sizeFormatted": "0.81 MB",
        "fileType": "image/jpeg",
        "id": "doc-1790419107523-doob",
        "name": "IMG_3437.jpeg",
        "dataUrl": "",
        "category": "quittance_acompte",
        "uploadedAt": "2026-09-26 10:38"
      }
    ],
    "vehicles": [
      {
        "requiredDepositTND": 30000,
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-1786454139529",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "carId": "car-1785753278797",
        "totalPriceTND": 88900,
        "quantity": 1,
        "unitPriceTND": 88900,
        "id": "v-1790418939445"
      }
    ],
    "depositPaidTND": 30000,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "ville": "Tunis",
        "prenom": "MOUNA",
        "cin": "05469914",
        "telephone": "29543066",
        "adresse": "",
        "email": "",
        "nom": "OUSLATI"
      }
    },
    "paymentMethod": "Chèque Certifié",
    "commercialName": "Moez Ben Naser"
  },
  {
    "status": "Confirmée",
    "vehicles": [
      {
        "unitPriceTND": 79900,
        "requiredDepositTND": 20000,
        "colorChosen": {
          "hexCode": "#050505",
          "name": "Black CL",
          "id": "col-1786982272954"
        },
        "id": "v-1790408887425",
        "totalPriceTND": 79900,
        "carId": "car-1785753066750",
        "carName": "Chery Tiggo 4 HEV",
        "quantity": 1
      }
    ],
    "colorChosen": {
      "hexCode": "#050505",
      "name": "Black CL",
      "id": "col-1786982272954"
    },
    "documents": [
      {
        "sizeFormatted": "0.17 MB",
        "uploadedAt": "2026-09-26 07:48",
        "dataUrl": "",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "name": "CIN ines Fakhfakh.pdf",
        "id": "doc-1790408926335-gwp6"
      },
      {
        "fileType": "application/pdf",
        "id": "doc-1790408937809-w3xg",
        "sizeFormatted": "0.16 MB",
        "name": "Accord Ines Fakhfakh.pdf",
        "dataUrl": "",
        "category": "accord_bancaire",
        "uploadedAt": "2026-09-26 07:48"
      }
    ],
    "agency": "Chery Agence Charguia 1",
    "etaDate": "2026-09-26",
    "carName": "Chery Tiggo 4 HEV (Black CL)",
    "paymentMethod": "Leasing",
    "notes": "⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés.",
    "commercialName": "K2EM CHERY Charguia 1",
    "client": {
      "personnePhysique": {
        "ville": "Tunis",
        "adresse": "",
        "nom": "Fakhfakh",
        "cin": "07254495",
        "email": "",
        "telephone": "98336100",
        "prenom": "Ines"
      },
      "type": "personne_physique"
    },
    "priceTND": 79900,
    "expectedDeliveryDate": "2026-10-26",
    "registrationFeeTND": 0,
    "createdAt": "2026-09-26T07:49:41.694Z",
    "depositPaidTND": 0,
    "commercialId": "user-1787557525876",
    "id": "RES-2026-1144",
    "carId": "car-1785753066750",
    "updatedAt": "2026-09-26T07:49:54.253Z"
  },
  {
    "id": "RES-2026-1142",
    "commercialId": "comm-moez",
    "commercialName": "Moez Ben Naser",
    "agency": "Siege STA",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Exclusive Blue WE)",
    "colorChosen": {
      "id": "col-1786454192522",
      "name": "Exclusive Blue WE",
      "hexCode": "#217CB5"
    },
    "vehicles": [
      {
        "id": "v-1790351459918",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-1786454192522",
          "name": "Exclusive Blue WE",
          "hexCode": "#217CB5"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900,
        "requiredDepositTND": 30000
      }
    ],
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE NEWTECH IT INTERNATIONAL",
        "matriculeFiscale": "15884425AM000",
        "ville": "Tunis",
        "telephone": "21618110",
        "email": "",
        "adresse": "",
        "registreCommerce": "15884425AM000"
      }
    },
    "documents": [
      {
        "id": "doc-1790351720636-jo3d",
        "name": "IMG_3431.jpeg",
        "category": "registre_commerce",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.29 MB",
        "uploadedAt": "2026-09-25 15:55"
      },
      {
        "id": "doc-1790351738234-kuet",
        "name": "IMG_3431.jpeg",
        "category": "quittance_acompte",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.29 MB",
        "uploadedAt": "2026-09-25 15:55"
      },
      {
        "id": "doc-1790351754091-gjsn",
        "name": "IMG_3431.jpeg",
        "category": "bon_commande",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.29 MB",
        "uploadedAt": "2026-09-25 15:55"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 30000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-25T15:56:35.525Z",
    "updatedAt": "2026-09-25T15:58:03.440Z",
    "etaDate": "2026-09-25",
    "expectedDeliveryDate": "2026-10-25",
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis."
  },
  {
    "vehicles": [
      {
        "requiredDepositTND": 30000,
        "carName": "Chery Tiggo 7 PHEV",
        "id": "v-1790328355950",
        "quantity": 1,
        "totalPriceTND": 88900,
        "colorChosen": {
          "id": "col-1786454139529",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "carId": "car-1785753278797",
        "unitPriceTND": 88900
      }
    ],
    "depositPaidTND": 15000,
    "client": {
      "personnePhysique": {
        "email": "",
        "nom": "ben ammar",
        "cin": "01347721",
        "telephone": "58356501",
        "prenom": "donia",
        "ville": "Sfax",
        "adresse": "sakiet eddayer "
      },
      "type": "personne_physique"
    },
    "paymentMethod": "Virement Bancaire",
    "documents": [
      {
        "id": "doc-1790329020327-lp9w",
        "uploadedAt": "2026-09-25 09:37",
        "dataUrl": "",
        "fileType": "application/pdf",
        "sizeFormatted": "0.10 MB",
        "name": "img20260925_10302458.pdf",
        "category": "cin_recto"
      },
      {
        "sizeFormatted": "0.10 MB",
        "id": "doc-1790329030331-61py",
        "uploadedAt": "2026-09-25 09:37",
        "name": "img20260925_10314382.pdf",
        "dataUrl": "",
        "fileType": "application/pdf",
        "category": "cin_verso"
      },
      {
        "notes": " [Pièce jointe archivée]",
        "sizeFormatted": "0.16 MB",
        "uploadedAt": "2026-09-25 09:37",
        "id": "doc-1790329054172-wv4n",
        "category": "quittance_acompte",
        "name": "img20260925_10335110.pdf",
        "dataUrl": "",
        "fileType": "application/pdf"
      },
      {
        "sizeFormatted": "0.32 MB",
        "id": "doc-1790329816756-iomz",
        "name": "img20260925_10494152.pdf",
        "category": "bon_commande",
        "notes": " [Pièce jointe archivée]",
        "fileType": "application/pdf",
        "dataUrl": "",
        "uploadedAt": "2026-09-25 09:50"
      },
      {
        "fileType": "application/pdf",
        "sizeFormatted": "0.33 MB",
        "dataUrl": "",
        "id": "doc-1790329816758-jtja",
        "uploadedAt": "2026-09-25 09:50",
        "category": "bon_commande",
        "notes": " [Pièce jointe archivée]",
        "name": "img20260925_10484452.pdf"
      },
      {
        "dataUrl": "",
        "fileType": "application/pdf",
        "id": "doc-1790329816760-anwl",
        "name": "img20260925_10355261.pdf",
        "notes": " [Pièce jointe archivée]",
        "category": "bon_commande",
        "sizeFormatted": "0.21 MB",
        "uploadedAt": "2026-09-25 09:50"
      }
    ],
    "commercialName": "DISTRICARS Sfax",
    "expectedDeliveryDate": "2026-10-25",
    "etaDate": "2026-09-25",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "id": "RES-2026-1141",
    "status": "Confirmée",
    "notes": "VIREMANENT 15000DT + LETTRE D'ENGAGEMENT 53 MILLE DINARS + NANTISSEMENT SUR VEHICULE | ⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "priceTND": 88900,
    "commercialId": "user-1787557241636",
    "createdAt": "2026-09-25T09:51:22.659Z",
    "registrationFeeTND": 0,
    "agency": "Chery Agence Sfax",
    "updatedAt": "2026-09-25T09:52:35.545Z",
    "colorChosen": {
      "id": "col-1786454139529",
      "hexCode": "#050505",
      "name": "Black CL"
    },
    "carId": "car-1785753278797"
  },
  {
    "commercialId": "comm-moez",
    "etaDate": "2026-09-25",
    "id": "RES-2026-1140",
    "depositPaidTND": 30000,
    "carName": "Chery Tiggo 7 PHEV (Tech Gray GX)",
    "createdAt": "2026-09-25T08:39:52.167Z",
    "paymentMethod": "Chèque Certifié",
    "updatedAt": "2026-09-25T08:40:39.779Z",
    "colorChosen": {
      "id": "col-3-1785753278797",
      "hexCode": "#727783",
      "name": "Tech Gray GX"
    },
    "agency": "Siege STA",
    "commercialName": "Moez Ben Naser",
    "status": "Confirmée",
    "priceTND": 88900,
    "documents": [
      {
        "uploadedAt": "2026-09-25 08:39",
        "dataUrl": "",
        "sizeFormatted": "1.74 MB",
        "category": "cin_recto",
        "name": "IMG_3421.jpeg",
        "id": "doc-1790325570701-xj62",
        "fileType": "image/jpeg"
      },
      {
        "name": "IMG_3422.jpeg",
        "category": "cin_verso",
        "uploadedAt": "2026-09-25 08:39",
        "sizeFormatted": "1.49 MB",
        "fileType": "image/jpeg",
        "id": "doc-1790325577128-mff6",
        "dataUrl": ""
      },
      {
        "dataUrl": "",
        "name": "IMG_3420.jpeg",
        "fileType": "image/jpeg",
        "id": "doc-1790325585662-0eoc",
        "uploadedAt": "2026-09-25 08:39",
        "sizeFormatted": "2.93 MB",
        "category": "quittance_acompte"
      }
    ],
    "registrationFeeTND": 0,
    "expectedDeliveryDate": "2026-10-25",
    "notes": "",
    "carId": "car-1785753278797",
    "vehicles": [
      {
        "requiredDepositTND": 30000,
        "colorChosen": {
          "name": "Tech Gray GX",
          "id": "col-3-1785753278797",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "unitPriceTND": 88900,
        "id": "v-1790325381473",
        "totalPriceTND": 88900
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "cin": "09528902",
        "email": "",
        "adresse": "",
        "prenom": "omar",
        "telephone": "55016108",
        "ville": "Tunis",
        "nom": "wanhazi"
      }
    }
  },
  {
    "id": "RES-2026-1139",
    "commercialId": "comm-marwa",
    "commercialName": "Marwa Frikha",
    "agency": "Siege STA",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
    "colorChosen": {
      "id": "col-2-1785753278797",
      "name": "Phantom Gray GV",
      "hexCode": "#939AA5"
    },
    "vehicles": [
      {
        "id": "v-1790324463978",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-2-1785753278797",
          "name": "Phantom Gray GV",
          "hexCode": "#939AA5"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900,
        "requiredDepositTND": 30000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "BENKHLIF",
        "prenom": "MOHAMED",
        "cin": "04351899",
        "ville": "Ben Arous",
        "telephone": "97320811",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [
      {
        "id": "doc-1790324571314-zzfx",
        "name": "17903245620803053365928177318425.jpg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "4.26 MB",
        "uploadedAt": "2026-09-25 08:22"
      },
      {
        "id": "doc-1790324581264-altu",
        "name": "17903245741875291215867121530665.jpg",
        "category": "cin_verso",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "2.22 MB",
        "uploadedAt": "2026-09-25 08:23"
      },
      {
        "id": "doc-1790324605536-jdtz",
        "name": "17903245943908257315038980641185.jpg",
        "category": "virement_bancaire",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "2.83 MB",
        "uploadedAt": "2026-09-25 08:23"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 30000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-25T08:23:29.475Z",
    "updatedAt": "2026-09-25T08:24:08.195Z",
    "etaDate": "2026-09-25",
    "expectedDeliveryDate": "2026-10-25",
    "notes": ""
  },
  {
    "id": "RES-2026-1138",
    "commercialId": "user-1787557241636",
    "commercialName": "DISTRICARS Sfax",
    "agency": "Chery Agence Sfax",
    "carId": "car-1785753208837",
    "carName": "Chery I03 4X4 (Black BL)",
    "colorChosen": {
      "id": "col-1-1785753208837",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "vehicles": [
      {
        "id": "v-1790266000481",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-1-1785753208837",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900,
        "requiredDepositTND": 20000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "KAMOUN",
        "prenom": "LASSAAD",
        "cin": "01313583",
        "ville": "Sfax",
        "telephone": "25373660",
        "email": "",
        "adresse": "SFAX"
      }
    },
    "documents": [
      {
        "id": "doc-1790266089280-h9hc",
        "name": "CHEQUE VERSABLE BIAT N° 0001463 MONTANT DE 20 MILLE DT DR LASSAAD KAMOUN.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.34 MB",
        "uploadedAt": "2026-09-24 16:08"
      }
    ],
    "priceTND": 84900,
    "registrationFeeTND": 0,
    "depositPaidTND": 20000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-24T16:09:46.160Z",
    "updatedAt": "2026-09-24T16:10:01.637Z",
    "etaDate": "2026-09-24",
    "expectedDeliveryDate": "2026-10-24",
    "notes": "CHEQUE BIAT N°0001463 MONTANT 20 MILLE DT VERSABLE AU NOM DE DR KAMOUN LASSAAD"
  },
  {
    "id": "RES-2026-1137",
    "commercialId": "user-1787557462429",
    "commercialName": "TAGOURTI CHERY Sousse",
    "agency": "Chery Agence Sousse",
    "carId": "car-1785753208837",
    "carName": "Chery I03 4X4 (Silver SL)",
    "colorChosen": {
      "id": "col-2-1785753208837",
      "name": "Silver SL",
      "hexCode": "#cfd3d8"
    },
    "vehicles": [
      {
        "id": "v-1790262043863",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-2-1785753208837",
          "name": "Silver SL",
          "hexCode": "#cfd3d8"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900,
        "requiredDepositTND": 20000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "TRABELSSI ",
        "prenom": "ATEF",
        "cin": "05567420",
        "ville": "Sousse",
        "telephone": "29666606",
        "email": "",
        "adresse": "RUE WEDDI JINEN AKOUDA SOUSSE"
      }
    },
    "documents": [
      {
        "id": "doc-1790262138743-p28i",
        "name": "cin quittance.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.62 MB",
        "uploadedAt": "2026-09-24 15:02"
      },
      {
        "id": "doc-1790262144170-zdwn",
        "name": "BC ATEF.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.32 MB",
        "uploadedAt": "2026-09-24 15:02"
      }
    ],
    "priceTND": 84900,
    "registrationFeeTND": 0,
    "depositPaidTND": 20000,
    "paymentMethod": "Dossier Bancaire",
    "status": "En attente",
    "createdAt": "2026-09-24T15:03:22.711Z",
    "updatedAt": "2026-09-24T15:03:22.711Z",
    "etaDate": "2026-09-24",
    "expectedDeliveryDate": "2026-10-24",
    "notes": ""
  },
  {
    "id": "RES-2026-1136",
    "commercialId": "user-1787557295837",
    "commercialName": "LCA CHERY Djerba",
    "agency": "Chery Agence Djerba",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (White BW)",
    "colorChosen": {
      "id": "col-1-1785753278797",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "vehicles": [
      {
        "id": "v-1790257589364",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-1-1785753278797",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900,
        "requiredDepositTND": 30000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "BEL HAD ALI",
        "prenom": "FIRAS",
        "cin": "08636823",
        "ville": "Médenine",
        "telephone": "25180645",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [
      {
        "id": "doc-1790257675667-wh37",
        "name": "ACCORD DE PRINCIPE --BELHAJ ALI FIRASS BEN MOHSEN.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.10 MB",
        "uploadedAt": "2026-09-24 13:47"
      },
      {
        "id": "doc-1790257675689-5lxp",
        "name": "69547624-2352-4bef-91fd-448673830734.jpg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.09 MB",
        "uploadedAt": "2026-09-24 13:47"
      },
      {
        "id": "doc-1790257675709-ji6t",
        "name": "9cfc4641-3f62-40f8-9355-7629c8bc08e2.jpg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.10 MB",
        "uploadedAt": "2026-09-24 13:47"
      },
      {
        "id": "doc-1790257675735-9z19",
        "name": "1c7ba21c-b8b3-4d05-a4ba-2010aea24507.jpg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.22 MB",
        "uploadedAt": "2026-09-24 13:47"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 0,
    "paymentMethod": "Leasing",
    "status": "En attente",
    "createdAt": "2026-09-24T13:48:14.466Z",
    "updatedAt": "2026-09-24T13:48:14.466Z",
    "etaDate": "2026-09-24",
    "expectedDeliveryDate": "2026-10-24",
    "notes": "⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés."
  },
  {
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-1-1785753278797",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "createdAt": "2026-09-24T11:31:56.917Z",
    "commercialId": "user-1787557295837",
    "vehicles": [
      {
        "id": "v-1790249356053",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-1-1785753278797",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900,
        "requiredDepositTND": 30000
      }
    ],
    "paymentMethod": "Virement Bancaire",
    "agency": "Chery Agence Djerba",
    "registrationFeeTND": 0,
    "id": "RES-2026-1135",
    "updatedAt": "2026-09-24T11:32:57.690Z",
    "notes": "",
    "commercialName": "LCA CHERY Djerba",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "OUKHAI",
        "prenom": "MOURAD",
        "cin": "07292155",
        "ville": "Médenine",
        "telephone": "98655353",
        "email": "",
        "adresse": ""
      }
    },
    "expectedDeliveryDate": "2026-10-24",
    "depositPaidTND": 30000,
    "documents": [
      {
        "id": "doc-1790249496064-ewjh",
        "name": "414b3f98-d5fe-44ee-8455-81d3b4c5b6cc.jpg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.10 MB",
        "uploadedAt": "2026-09-24 11:31"
      },
      {
        "id": "doc-1790249496089-ai6c",
        "name": "3eca3a03-5595-45e7-b1eb-debf792fe6eb.jpg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.16 MB",
        "uploadedAt": "2026-09-24 11:31"
      },
      {
        "id": "doc-1790249496114-kjza",
        "name": "b73ba254-10d7-4b7c-8e5b-5393e74173f5.jpg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.19 MB",
        "uploadedAt": "2026-09-24 11:31"
      },
      {
        "id": "doc-1790249496144-jv16",
        "name": "9157b16e-c582-4002-8e9a-5581d90ce119.jpg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.30 MB",
        "uploadedAt": "2026-09-24 11:31"
      }
    ],
    "etaDate": "2026-09-24",
    "priceTND": 88900,
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (White BW)"
  },
  {
    "paymentMethod": "Chèque Certifié",
    "registrationFeeTND": 0,
    "commercialId": "user-1787557241636",
    "status": "Confirmée",
    "colorChosen": {
      "name": "Black CL",
      "hexCode": "#050505",
      "id": "col-1786982272954"
    },
    "vehicles": [
      {
        "carName": "Chery Tiggo 4 HEV",
        "unitPriceTND": 79900,
        "requiredDepositTND": 20000,
        "quantity": 1,
        "totalPriceTND": 79900,
        "id": "v-1790247169712",
        "colorChosen": {
          "hexCode": "#050505",
          "name": "Black CL",
          "id": "col-1786982272954"
        },
        "carId": "car-1785753066750"
      }
    ],
    "agency": "Chery Agence Sfax",
    "createdAt": "2026-09-24T10:57:51.423Z",
    "updatedAt": "2026-09-24T10:58:06.952Z",
    "client": {
      "personnePhysique": {
        "telephone": "20240717",
        "ville": "Sfax",
        "nom": "YANGUI",
        "adresse": "SFAX",
        "prenom": "NAJET",
        "cin": "01304627",
        "email": ""
      },
      "type": "personne_physique"
    },
    "depositPaidTND": 30000,
    "carId": "car-1785753066750",
    "expectedDeliveryDate": "2026-10-24",
    "notes": "ORDRE DE VIREMENT AU NOM DE HALOUANI MONGI L'EPOUX DE MME NAJET YANGUI MONTANT DE 30 MILLE DINARS LE 24-09-2026",
    "documents": [
      {
        "fileType": "application/pdf",
        "id": "doc-1790247369325-w93o",
        "sizeFormatted": "0.36 MB",
        "dataUrl": "",
        "uploadedAt": "2026-09-24 10:56",
        "category": "cin_recto",
        "name": "NAJET YANGUI TIGGO4 HEV NOIR.pdf"
      }
    ],
    "commercialName": "DISTRICARS Sfax",
    "id": "RES-2026-1134",
    "priceTND": 79900,
    "carName": "Chery Tiggo 4 HEV (Black CL)",
    "etaDate": "2026-09-24"
  },
  {
    "commercialId": "user-1787557525876",
    "expectedDeliveryDate": "2026-10-24",
    "status": "Confirmée",
    "vehicles": [
      {
        "requiredDepositTND": 30000,
        "quantity": 1,
        "unitPriceTND": 88900,
        "carName": "Chery Tiggo 7 PHEV",
        "carId": "car-1785753278797",
        "id": "v-1790245633497",
        "colorChosen": {
          "name": "Phantom Gray GV",
          "hexCode": "#939AA5",
          "id": "col-2-1785753278797"
        },
        "totalPriceTND": 88900
      }
    ],
    "agency": "Chery Agence Charguia 1",
    "id": "RES-2026-1133",
    "updatedAt": "2026-09-24T10:48:15.261Z",
    "paymentMethod": "Leasing",
    "registrationFeeTND": 0,
    "colorChosen": {
      "name": "Phantom Gray GV",
      "hexCode": "#939AA5",
      "id": "col-2-1785753278797"
    },
    "createdAt": "2026-09-24T10:48:15.261Z",
    "client": {
      "personnePhysique": {
        "prenom": "Mohamed",
        "adresse": "",
        "email": "",
        "ville": "Tunis",
        "nom": "Cherif",
        "telephone": "98601864",
        "cin": "00701339"
      },
      "type": "personne_physique"
    },
    "commercialName": "K2EM CHERY Charguia 1",
    "carId": "car-1785753278797",
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "documents": [
      {
        "sizeFormatted": "0.12 MB",
        "fileType": "application/pdf",
        "id": "doc-1790246720398-vh3z",
        "category": "cin_recto",
        "name": "M.Cherif recto.pdf",
        "uploadedAt": "2026-09-24 10:45",
        "dataUrl": ""
      },
      {
        "sizeFormatted": "0.15 MB",
        "category": "cin_verso",
        "id": "doc-1790246729015-utjl",
        "uploadedAt": "2026-09-24 10:45",
        "dataUrl": "",
        "fileType": "application/pdf",
        "name": "M.Cherif verso.pdf"
      },
      {
        "category": "bon_commande",
        "uploadedAt": "2026-09-24 10:45",
        "id": "doc-1790246741919-sg83",
        "dataUrl": "",
        "sizeFormatted": "0.18 MB",
        "fileType": "application/pdf",
        "name": "BC Mohamed Cherif.pdf"
      }
    ],
    "priceTND": 88900,
    "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
    "depositPaidTND": 0,
    "etaDate": "2026-09-24"
  },
  {
    "createdAt": "2026-09-24T10:04:30.371Z",
    "colorChosen": {
      "hexCode": "#6E6F72",
      "name": "Gray GV",
      "id": "col-3-1785753066750"
    },
    "updatedAt": "2026-09-24T10:04:30.371Z",
    "client": {
      "personnePhysique": {
        "adresse": "",
        "telephone": "25055055",
        "cin": "05451926",
        "nom": "ATIG",
        "ville": "Tunis",
        "prenom": "BAHAR AMIR",
        "email": ""
      },
      "type": "personne_physique"
    },
    "priceTND": 79900,
    "registrationFeeTND": 0,
    "id": "RES-2026-1132",
    "paymentMethod": "Leasing",
    "commercialId": "user-1787821380306",
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "status": "Confirmée",
    "documents": [
      {
        "fileType": "application/pdf",
        "sizeFormatted": "0.22 MB",
        "uploadedAt": "2026-09-24 10:04",
        "category": "cin_recto",
        "name": "CIN ATIG.pdf",
        "dataUrl": "",
        "id": "doc-1790244252313-o87x",
        "notes": " [Pièce jointe archivée]"
      },
      {
        "name": "CIN ATIG.pdf",
        "uploadedAt": "2026-09-24 10:04",
        "category": "cin_verso",
        "fileType": "application/pdf",
        "dataUrl": "",
        "id": "doc-1790244255583-4hcy",
        "notes": " [Pièce jointe archivée]",
        "sizeFormatted": "0.22 MB"
      },
      {
        "notes": " [Pièce jointe archivée]",
        "dataUrl": "",
        "sizeFormatted": "0.56 MB",
        "name": "BON DE COMMANDE.pdf",
        "uploadedAt": "2026-09-24 10:04",
        "fileType": "application/pdf",
        "category": "bon_commande",
        "id": "doc-1790244264354-peod"
      }
    ],
    "etaDate": "2026-09-24",
    "commercialName": "Racha Jebeniani",
    "carName": "Chery Tiggo 4 HEV (Gray GV)",
    "agency": "Chery siege",
    "vehicles": [
      {
        "id": "v-1790243856781",
        "colorChosen": {
          "name": "Gray GV",
          "hexCode": "#6E6F72",
          "id": "col-3-1785753066750"
        },
        "quantity": 1,
        "carName": "Chery Tiggo 4 HEV",
        "unitPriceTND": 79900,
        "requiredDepositTND": 20000,
        "totalPriceTND": 79900,
        "carId": "car-1785753066750"
      }
    ],
    "carId": "car-1785753066750",
    "depositPaidTND": 0,
    "expectedDeliveryDate": "2026-10-24"
  },
  {
    "expectedDeliveryDate": "2026-10-24",
    "paymentMethod": "Chèque Certifié",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "ville": "Tunis",
        "prenom": "HABIB MOHAMED",
        "cin": "02243751",
        "adresse": "",
        "email": "",
        "telephone": "98506488",
        "nom": "LIMEM"
      }
    },
    "etaDate": "2026-09-24",
    "documents": [
      {
        "id": "doc-1790242290583-8hyf",
        "name": "cin habib.pdf",
        "uploadedAt": "2026-09-24 09:31",
        "notes": " [Pièce jointe archivée]",
        "category": "cin_recto",
        "sizeFormatted": "0.70 MB",
        "dataUrl": "",
        "fileType": "application/pdf"
      },
      {
        "id": "doc-1790242293851-2bf8",
        "category": "cin_verso",
        "name": "cin habib.pdf",
        "dataUrl": "",
        "notes": " [Pièce jointe archivée]",
        "sizeFormatted": "0.70 MB",
        "uploadedAt": "2026-09-24 09:31",
        "fileType": "application/pdf"
      },
      {
        "sizeFormatted": "0.31 MB",
        "dataUrl": "",
        "uploadedAt": "2026-09-24 09:31",
        "fileType": "application/pdf",
        "name": "cheque habib.pdf",
        "category": "quittance_acompte",
        "id": "doc-1790242296943-k2wj",
        "notes": " [Pièce jointe archivée]"
      },
      {
        "uploadedAt": "2026-09-24 09:31",
        "notes": " [Pièce jointe archivée]",
        "dataUrl": "",
        "name": "qt habib.pdf",
        "fileType": "application/pdf",
        "id": "doc-1790242306421-ag8d",
        "sizeFormatted": "0.50 MB",
        "category": "autre"
      }
    ],
    "commercialId": "user-1787821380306",
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "colorChosen": {
      "hexCode": "#050505",
      "id": "col-1786454139529",
      "name": "Black CL"
    },
    "id": "RES-2026-1131",
    "carId": "car-1785753278797",
    "commercialName": "Racha Jebeniani",
    "agency": "Chery siege",
    "depositPaidTND": 30000,
    "vehicles": [
      {
        "unitPriceTND": 88900,
        "requiredDepositTND": 30000,
        "carId": "car-1785753278797",
        "quantity": 1,
        "id": "v-1790242169754",
        "totalPriceTND": 88900,
        "colorChosen": {
          "id": "col-1786454139529",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "carName": "Chery Tiggo 7 PHEV"
      }
    ],
    "updatedAt": "2026-09-24T11:04:42.734Z",
    "createdAt": "2026-09-24T09:31:52.518Z",
    "status": "Confirmée",
    "notes": ""
  },
  {
    "commercialId": "user-1787821380306",
    "id": "RES-2026-1130",
    "carId": "car-1785753208837",
    "carName": "Chery I03 4X4 (Green GN)",
    "etaDate": "2026-09-24",
    "status": "Confirmée",
    "priceTND": 84900,
    "agency": "Chery siege",
    "colorChosen": {
      "id": "col-1786454514433",
      "hexCode": "#255645",
      "name": "Green GN"
    },
    "documents": [
      {
        "fileType": "application/pdf",
        "uploadedAt": "2026-09-24 09:23",
        "name": "CIN ASMA SAIED EP ABDELMOULA(1).pdf",
        "sizeFormatted": "0.28 MB",
        "notes": " [Pièce jointe archivée]",
        "dataUrl": "",
        "category": "cin_recto",
        "id": "doc-1790241784475-it75"
      },
      {
        "name": "CIN ASMA SAIED EP ABDELMOULA(1).pdf",
        "dataUrl": "",
        "category": "cin_verso",
        "notes": " [Pièce jointe archivée]",
        "uploadedAt": "2026-09-24 09:23",
        "fileType": "application/pdf",
        "id": "doc-1790241787234-no1n",
        "sizeFormatted": "0.28 MB"
      },
      {
        "category": "quittance_acompte",
        "id": "doc-1790241793377-dxg1",
        "sizeFormatted": "0.23 MB",
        "notes": " [Pièce jointe archivée]",
        "dataUrl": "",
        "fileType": "application/pdf",
        "uploadedAt": "2026-09-24 09:23",
        "name": "AVNCE.pdf"
      }
    ],
    "notes": "",
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 20000,
    "registrationFeeTND": 0,
    "client": {
      "personnePhysique": {
        "telephone": "55800600",
        "nom": "SAID",
        "ville": "Tunis",
        "cin": "05466115",
        "adresse": "",
        "prenom": "ASMA",
        "email": ""
      },
      "type": "personne_physique"
    },
    "updatedAt": "2026-09-24T11:04:45.902Z",
    "commercialName": "Racha Jebeniani",
    "expectedDeliveryDate": "2026-10-24",
    "vehicles": [
      {
        "colorChosen": {
          "name": "Green GN",
          "id": "col-1786454514433",
          "hexCode": "#255645"
        },
        "carName": "Chery I03 4X4",
        "totalPriceTND": 84900,
        "carId": "car-1785753208837",
        "id": "v-1790241751538",
        "requiredDepositTND": 20000,
        "quantity": 1,
        "unitPriceTND": 84900
      }
    ],
    "createdAt": "2026-09-24T09:23:19.490Z"
  },
  {
    "status": "En attente",
    "createdAt": "2026-09-24T09:08:13.561Z",
    "updatedAt": "2026-09-24T09:08:13.561Z",
    "commercialName": "Moez Ben Naser",
    "id": "RES-2026-1129",
    "vehicles": [
      {
        "id": "v-1790240807133",
        "totalPriceTND": 88900,
        "unitPriceTND": 88900,
        "quantity": 1,
        "requiredDepositTND": 30000,
        "colorChosen": {
          "name": "White BW",
          "hexCode": "#FFFFFF",
          "id": "col-1-1785753278797"
        },
        "carName": "Chery Tiggo 7 PHEV",
        "carId": "car-1785753278797"
      }
    ],
    "colorChosen": {
      "hexCode": "#FFFFFF",
      "name": "White BW",
      "id": "col-1-1785753278797"
    },
    "agency": "Siege STA",
    "depositPaidTND": 30000,
    "notes": "",
    "registrationFeeTND": 0,
    "documents": [
      {
        "category": "cin_recto",
        "sizeFormatted": "2.87 MB",
        "name": "IMG_3382.jpeg",
        "id": "doc-1790240868121-2pah",
        "uploadedAt": "2026-09-24 09:07",
        "fileType": "image/jpeg",
        "dataUrl": ""
      },
      {
        "uploadedAt": "2026-09-24 09:07",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "id": "doc-1790240876611-fn1t",
        "sizeFormatted": "2.77 MB",
        "category": "cin_verso",
        "name": "IMG_3383.jpeg"
      },
      {
        "category": "quittance_acompte",
        "sizeFormatted": "2.76 MB",
        "name": "IMG_3384.jpeg",
        "dataUrl": "",
        "uploadedAt": "2026-09-24 09:08",
        "fileType": "image/jpeg",
        "id": "doc-1790240885078-zwwy"
      },
      {
        "uploadedAt": "2026-09-24 09:08",
        "sizeFormatted": "2.76 MB",
        "name": "IMG_3384.jpeg",
        "fileType": "image/jpeg",
        "id": "doc-1790240891208-xg65",
        "category": "quittance_acompte",
        "dataUrl": ""
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "ville": "Tunis",
        "prenom": "ZAYED",
        "nom": "CHETOUI",
        "telephone": "98216296",
        "adresse": "",
        "email": "",
        "cin": "05713755"
      }
    },
    "expectedDeliveryDate": "2026-10-24",
    "paymentMethod": "Chèque Certifié",
    "etaDate": "2026-09-24",
    "carId": "car-1785753278797",
    "priceTND": 88900,
    "commercialId": "comm-moez",
    "carName": "Chery Tiggo 7 PHEV (White BW)"
  },
  {
    "carId": "car-1785512735025",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "prenom": "YASMINE",
        "ville": "Médenine",
        "nom": "FOUZRI",
        "adresse": "JARDIN MENZEH 2  ARIANA",
        "cin": "09191405",
        "telephone": "99048573",
        "email": ""
      }
    },
    "documents": [
      {
        "category": "cin_recto",
        "name": "Bon de Commande N°IAR2626600028.1.pdf",
        "dataUrl": "",
        "fileType": "application/pdf",
        "sizeFormatted": "0.12 MB",
        "uploadedAt": "2026-09-24 09:06",
        "id": "doc-1790240802473-i7k4"
      },
      {
        "name": "476ca5a3-5db4-451a-b62d-6cdd6f14d878.jpg",
        "category": "cin_recto",
        "uploadedAt": "2026-09-24 09:06",
        "dataUrl": "",
        "sizeFormatted": "0.08 MB",
        "id": "doc-1790240802527-qkhy",
        "fileType": "image/jpeg"
      },
      {
        "id": "doc-1790240802547-1tdg",
        "name": "571027d3-7c37-43a3-932d-0c2397add41c.jpg",
        "sizeFormatted": "0.08 MB",
        "fileType": "image/jpeg",
        "category": "cin_recto",
        "dataUrl": "",
        "uploadedAt": "2026-09-24 09:06"
      },
      {
        "id": "doc-1790240802570-vk79",
        "category": "cin_recto",
        "uploadedAt": "2026-09-24 09:06",
        "sizeFormatted": "0.10 MB",
        "name": "b04e43ed-7067-4c42-8664-faaf2274a1c0.jpg",
        "dataUrl": "",
        "fileType": "image/jpeg"
      }
    ],
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "totalPriceTND": 89900,
        "quantity": 1,
        "colorChosen": {
          "hexCode": "#727783",
          "id": "col-2-1785512735025",
          "name": "Tech Gray GX"
        },
        "requiredDepositTND": 30000,
        "carId": "car-1785512735025",
        "carName": "Chery Arrizo 8 PHEV",
        "id": "v-1790240583598",
        "unitPriceTND": 89900
      }
    ],
    "colorChosen": {
      "hexCode": "#727783",
      "id": "col-2-1785512735025",
      "name": "Tech Gray GX"
    },
    "carName": "Chery Arrizo 8 PHEV (Tech Gray GX)",
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "paymentMethod": "Leasing",
    "etaDate": "2026-09-24",
    "updatedAt": "2026-09-24T09:07:34.337Z",
    "createdAt": "2026-09-24T09:07:34.337Z",
    "id": "RES-2026-1128",
    "status": "Confirmée",
    "depositPaidTND": 0,
    "agency": "Chery Agence Djerba",
    "priceTND": 89900,
    "commercialName": "LCA CHERY Djerba",
    "commercialId": "user-1787557295837",
    "expectedDeliveryDate": "2026-10-24"
  },
  {
    "notes": "",
    "client": {
      "personnePhysique": {
        "nom": "BOUKRIBA",
        "email": "",
        "cin": "04722380",
        "ville": "Tunis",
        "prenom": "SAIFFEDINE",
        "telephone": "55001014",
        "adresse": ""
      },
      "type": "personne_physique"
    },
    "documents": [
      {
        "name": "CIN.pdf",
        "category": "cin_recto",
        "notes": " [Pièce jointe archivée]",
        "sizeFormatted": "9.06 MB",
        "uploadedAt": "2026-09-24 08:40",
        "id": "doc-1790239208104-y82y",
        "dataUrl": "",
        "fileType": "application/pdf"
      },
      {
        "id": "doc-1790239210669-iyok",
        "fileType": "application/pdf",
        "notes": " [Pièce jointe archivée]",
        "category": "cin_verso",
        "uploadedAt": "2026-09-24 08:40",
        "sizeFormatted": "9.06 MB",
        "name": "CIN.pdf",
        "dataUrl": ""
      },
      {
        "name": "ENGAGEMENT.pdf",
        "category": "accord_bancaire",
        "uploadedAt": "2026-09-24 08:40",
        "sizeFormatted": "4.96 MB",
        "notes": " [Pièce jointe archivée]",
        "dataUrl": "",
        "id": "doc-1790239226754-y4aj",
        "fileType": "application/pdf"
      }
    ],
    "id": "RES-2026-1127",
    "commercialId": "user-1787821380306",
    "expectedDeliveryDate": "2026-10-24",
    "priceTND": 129900,
    "carId": "car-1785513071800",
    "registrationFeeTND": 0,
    "depositPaidTND": 77900,
    "status": "En attente",
    "updatedAt": "2026-09-24T09:16:09.176Z",
    "etaDate": "2026-09-24",
    "createdAt": "2026-09-24T08:41:26.649Z",
    "carName": "Chery Tiggo 9 PHEV (Tech Gray GX)",
    "colorChosen": {
      "hexCode": "#030303",
      "name": "Black CM",
      "id": "col-1786981421374"
    },
    "commercialName": "Racha Jebeniani",
    "paymentMethod": "Dossier Bancaire",
    "agency": "Chery siege",
    "vehicles": [
      {
        "colorChosen": {
          "id": "col-3-1785513071800",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "id": "v-1790238538874",
        "carId": "car-1785513071800",
        "requiredDepositTND": 50000,
        "quantity": 1,
        "totalPriceTND": 129900,
        "unitPriceTND": 129900,
        "carName": "Chery Tiggo 9 PHEV"
      }
    ]
  },
  {
    "agency": "Chery siege",
    "createdAt": "2026-09-24T08:27:48.663Z",
    "updatedAt": "2026-09-24T08:27:48.663Z",
    "carId": "car-1785513071800",
    "commercialName": "Racha Jebeniani",
    "notes": "⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés.",
    "paymentMethod": "Dossier Bancaire",
    "expectedDeliveryDate": "2026-10-24",
    "depositPaidTND": 121440,
    "status": "En attente",
    "colorChosen": {
      "hexCode": "#727783",
      "id": "col-3-1785513071800",
      "name": "Tech Gray GX"
    },
    "vehicles": [
      {
        "requiredDepositTND": 50000,
        "colorChosen": {
          "hexCode": "#727783",
          "name": "Tech Gray GX",
          "id": "col-3-1785513071800"
        },
        "id": "v-1790238329069",
        "totalPriceTND": 129900,
        "unitPriceTND": 129900,
        "quantity": 1,
        "carName": "Chery Tiggo 9 PHEV",
        "carId": "car-1785513071800"
      }
    ],
    "carName": "Chery Tiggo 9 PHEV (Tech Gray GX)",
    "documents": [
      {
        "notes": " [Pièce jointe archivée]",
        "fileType": "application/pdf",
        "sizeFormatted": "1.11 MB",
        "category": "registre_commerce",
        "id": "doc-1790238415075-le3p",
        "uploadedAt": "2026-09-24 08:26",
        "dataUrl": "",
        "name": "rne.pdf"
      },
      {
        "notes": " [Pièce jointe archivée]",
        "category": "accord_bancaire",
        "name": "accord.pdf",
        "sizeFormatted": "0.63 MB",
        "id": "doc-1790238422564-ht1f",
        "dataUrl": "",
        "fileType": "application/pdf",
        "uploadedAt": "2026-09-24 08:27"
      },
      {
        "fileType": "application/pdf",
        "dataUrl": "",
        "notes": " [Pièce jointe archivée]",
        "name": "qt.pdf",
        "id": "doc-1790238428719-xs62",
        "sizeFormatted": "0.31 MB",
        "uploadedAt": "2026-09-24 08:27",
        "category": "autre"
      }
    ],
    "etaDate": "2026-09-24",
    "commercialId": "user-1787821380306",
    "client": {
      "societe": {
        "raisonSociale": "STE JACODIS",
        "ville": "Ben Arous",
        "matriculeFiscale": "1065999W",
        "registreCommerce": "",
        "adresse": "",
        "email": "",
        "telephone": "98434925"
      },
      "type": "societe"
    },
    "registrationFeeTND": 0,
    "id": "RES-2026-1126",
    "priceTND": 129900
  },
  {
    "expectedDeliveryDate": "2026-10-24",
    "carId": "car-1787908920743",
    "documents": [
      {
        "dataUrl": "",
        "name": "recto.jpeg",
        "sizeFormatted": "0.23 MB",
        "category": "cin_recto",
        "uploadedAt": "2026-09-24 08:22",
        "fileType": "image/jpeg",
        "id": "doc-1790238145599-xr2w"
      },
      {
        "fileType": "image/jpeg",
        "sizeFormatted": "0.24 MB",
        "id": "doc-1790238151333-19hp",
        "name": "verso.jpeg",
        "dataUrl": "",
        "uploadedAt": "2026-09-24 08:22",
        "category": "cin_verso"
      },
      {
        "category": "bon_commande",
        "id": "doc-1790238181953-ya1p",
        "name": "B.C SEIFEDDINE JANZOURI.pdf",
        "sizeFormatted": "0.34 MB",
        "uploadedAt": "2026-09-24 08:23",
        "dataUrl": "",
        "fileType": "application/pdf"
      }
    ],
    "carName": "Chery Himla 4X4 BVA (Black CH)",
    "depositPaidTND": 0,
    "status": "Confirmée",
    "etaDate": "2026-09-24",
    "agency": "Chery Agence Charguia 1",
    "commercialName": "K2EM CHERY Charguia 1",
    "vehicles": [
      {
        "requiredDepositTND": 20000,
        "carId": "car-1787908920743",
        "carName": "Chery Himla 4X4 BVA",
        "quantity": 1,
        "unitPriceTND": 119900,
        "id": "v-1790237972137",
        "totalPriceTND": 119900,
        "colorChosen": {
          "name": "Black CH",
          "hexCode": "#0A0A0A",
          "id": "col-3-1787908920743"
        }
      }
    ],
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "registrationFeeTND": 0,
    "colorChosen": {
      "id": "col-3-1787908920743",
      "name": "Black CH",
      "hexCode": "#0A0A0A"
    },
    "createdAt": "2026-09-24T08:23:10.993Z",
    "commercialId": "user-1787557525876",
    "client": {
      "personnePhysique": {
        "email": "",
        "nom": "Janzouri",
        "adresse": "",
        "telephone": "26462580",
        "ville": "Tunis",
        "prenom": "Saif Eddine",
        "cin": "13208769"
      },
      "type": "personne_physique"
    },
    "updatedAt": "2026-09-24T08:23:10.993Z",
    "id": "RES-2026-1125",
    "priceTND": 119900,
    "paymentMethod": "Leasing"
  },
  {
    "expectedDeliveryDate": "2026-10-24",
    "id": "RES-2026-1124",
    "depositPaidTND": 0,
    "priceTND": 84900,
    "client": {
      "type": "societe",
      "societe": {
        "matriculeFiscale": "0875066G",
        "ville": "Nabeul",
        "registreCommerce": "",
        "email": "",
        "raisonSociale": "SOCIETE BARBEROUSSE",
        "adresse": "",
        "telephone": "29722962"
      }
    },
    "carName": "Chery I03 4X4 (Gray GY)",
    "etaDate": "2026-09-24",
    "updatedAt": "2026-09-24T07:58:04.026Z",
    "createdAt": "2026-09-24T07:58:04.026Z",
    "paymentMethod": "Leasing",
    "commercialName": "GODDI CHERY Nabeul",
    "agency": "Chery Agence Nabeul",
    "colorChosen": {
      "id": "col-1786454499484",
      "name": "Gray GY",
      "hexCode": "#626a68"
    },
    "vehicles": [
      {
        "colorChosen": {
          "hexCode": "#626a68",
          "id": "col-1786454499484",
          "name": "Gray GY"
        },
        "id": "v-1790236068463",
        "requiredDepositTND": 20000,
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "totalPriceTND": 84900,
        "quantity": 1,
        "unitPriceTND": 84900
      }
    ],
    "carId": "car-1785753208837",
    "notes": "⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés.",
    "commercialId": "user-1787557344213",
    "documents": [
      {
        "sizeFormatted": "0.10 MB",
        "category": "cin_recto",
        "dataUrl": "",
        "id": "doc-1790236171477-40l7",
        "uploadedAt": "2026-09-24 07:49",
        "name": "ACCORD.pdf",
        "fileType": "application/pdf"
      },
      {
        "name": "RNE BARBEROUSSE.pdf",
        "dataUrl": "",
        "category": "cin_recto",
        "id": "doc-1790236171556-p2sp",
        "fileType": "application/pdf",
        "uploadedAt": "2026-09-24 07:49",
        "sizeFormatted": "0.19 MB"
      }
    ],
    "registrationFeeTND": 0,
    "status": "En attente"
  },
  {
    "carId": "car-1787908920743",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "ABID",
        "prenom": "MOUNIR",
        "cin": "01264915",
        "ville": "Sfax",
        "telephone": "22811352",
        "email": "",
        "adresse": "SFAX"
      }
    },
    "commercialName": "DISTRICARS Sfax",
    "vehicles": [
      {
        "id": "v-1790177528362",
        "carId": "car-1787908920743",
        "carName": "Chery Himla 4X4 BVA",
        "colorChosen": {
          "id": "col-3-1787908920743",
          "name": "Black CH",
          "hexCode": "#0A0A0A"
        },
        "quantity": 1,
        "unitPriceTND": 119900,
        "totalPriceTND": 119900,
        "requiredDepositTND": 20000
      }
    ],
    "createdAt": "2026-09-23T15:38:23.817Z",
    "updatedAt": "2026-09-23T15:38:41.689Z",
    "depositPaidTND": 0,
    "carName": "Chery Himla 4X4 BVA (Black CH)",
    "notes": "CI-JOINT DOSSIER COMPLET CG HANNIBAL LEASE  | ⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés.",
    "etaDate": "2026-09-23",
    "id": "RES-2026-1123",
    "colorChosen": {
      "id": "col-3-1787908920743",
      "name": "Black CH",
      "hexCode": "#0A0A0A"
    },
    "paymentMethod": "Leasing",
    "expectedDeliveryDate": "2026-10-23",
    "commercialId": "user-1787557241636",
    "status": "Confirmée",
    "registrationFeeTND": 0,
    "documents": [
      {
        "id": "doc-1790177875761-nnpr",
        "name": "img20260923_16373134.pdf",
        "category": "accord_leasing",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "2.10 MB",
        "uploadedAt": "2026-09-23 15:37"
      }
    ],
    "agency": "Chery Agence Sfax",
    "priceTND": 119900
  },
  {
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "RIHARI ",
        "prenom": "NAIMA",
        "cin": "07093937",
        "ville": "Tunis",
        "telephone": "29786174",
        "email": "",
        "adresse": ""
      }
    },
    "id": "RES-2026-1122",
    "priceTND": 102900,
    "carId": "car-1785514106502",
    "expectedDeliveryDate": "2026-10-23",
    "documents": [
      {
        "id": "doc-1790166957832-otik",
        "name": "IMG_3360.jpeg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "2.59 MB",
        "uploadedAt": "2026-09-23 12:35"
      },
      {
        "id": "doc-1790166964059-pyjq",
        "name": "IMG_3361.jpeg",
        "category": "cin_verso",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "2.45 MB",
        "uploadedAt": "2026-09-23 12:36"
      },
      {
        "id": "doc-1790166969975-ixy7",
        "name": "IMG_3362.jpeg",
        "category": "quittance_acompte",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "2.76 MB",
        "uploadedAt": "2026-09-23 12:36"
      }
    ],
    "notes": "",
    "carName": "Chery Himla 4X4 BVM (Black CH)",
    "etaDate": "2026-09-23",
    "vehicles": [
      {
        "id": "v-1790166778752",
        "carId": "car-1785514106502",
        "carName": "Chery Himla 4X4 BVM",
        "colorChosen": {
          "id": "col-1786981947069",
          "name": "Black CH",
          "hexCode": "#0A0A0A"
        },
        "quantity": 1,
        "unitPriceTND": 102900,
        "totalPriceTND": 102900,
        "requiredDepositTND": 20000
      }
    ],
    "depositPaidTND": 20000,
    "colorChosen": {
      "id": "col-1786981947069",
      "name": "Black CH",
      "hexCode": "#0A0A0A"
    },
    "status": "Confirmée",
    "commercialId": "comm-moez",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-23T12:36:33.117Z",
    "commercialName": "Moez Ben Naser",
    "agency": "Siege STA",
    "registrationFeeTND": 0,
    "updatedAt": "2026-09-23T12:36:55.067Z"
  },
  {
    "registrationFeeTND": 0,
    "updatedAt": "2026-09-23T09:24:27.659Z",
    "priceTND": 84900,
    "commercialName": "Nader Chtourou",
    "id": "RES-2026-1121",
    "colorChosen": {
      "id": "col-1-1785753208837",
      "hexCode": "#171717",
      "name": "Black BL"
    },
    "createdAt": "2026-09-23T09:24:27.659Z",
    "agency": "Chery Agence Sfax",
    "status": "En attente",
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 20000,
    "expectedDeliveryDate": "2026-10-23",
    "etaDate": "2026-09-23",
    "carName": "Chery I03 4X4 (Black BL)",
    "documents": [],
    "notes": "",
    "vehicles": [
      {
        "unitPriceTND": 84900,
        "id": "v-1790155335328",
        "carName": "Chery I03 4X4",
        "quantity": 1,
        "colorChosen": {
          "name": "Black BL",
          "id": "col-1-1785753208837",
          "hexCode": "#171717"
        },
        "totalPriceTND": 84900,
        "carId": "car-1785753208837",
        "requiredDepositTND": 20000
      }
    ],
    "commercialId": "user-1785739349068",
    "carId": "car-1785753208837",
    "client": {
      "societe": {
        "ville": "Sfax",
        "telephone": "54111672",
        "raisonSociale": "SOCIETE SOLIMANE DE TRAVAUX PUBLIC",
        "email": "",
        "matriculeFiscale": "1661526L",
        "adresse": "RTE KAIED MHAMED KM 3",
        "registreCommerce": ""
      },
      "type": "societe"
    }
  },
  {
    "agency": "Chery Agence Charguia 1",
    "commercialName": "K2EM CHERY Charguia 1",
    "depositPaidTND": 30000,
    "expectedDeliveryDate": "2026-10-23",
    "registrationFeeTND": 0,
    "createdAt": "2026-09-23T08:30:38.430Z",
    "status": "Confirmée",
    "priceTND": 88900,
    "updatedAt": "2026-09-23T08:30:48.697Z",
    "id": "RES-2026-1120",
    "paymentMethod": "Virement Bancaire",
    "carId": "car-1785753278797",
    "documents": [
      {
        "id": "doc-1790152214513-wqje",
        "name": "anis recto.jpeg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.07 MB",
        "uploadedAt": "2026-09-23 08:30"
      },
      {
        "id": "doc-1790152220350-pgb4",
        "name": "anis verso.jpeg",
        "category": "cin_verso",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.12 MB",
        "uploadedAt": "2026-09-23 08:30"
      },
      {
        "id": "doc-1790152228418-5jdf",
        "name": "Virement.jpeg",
        "category": "quittance_acompte",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.13 MB",
        "uploadedAt": "2026-09-23 08:30"
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Ksantini",
        "prenom": "Anis",
        "cin": "07432665",
        "ville": "Tunis",
        "telephone": "55183705",
        "email": "",
        "adresse": ""
      }
    },
    "carName": "Chery Tiggo 7 PHEV (White BW)",
    "notes": "",
    "etaDate": "2026-09-23",
    "vehicles": [
      {
        "id": "v-1790152164131",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-1-1785753278797",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900,
        "requiredDepositTND": 30000
      }
    ],
    "commercialId": "user-1787557525876",
    "colorChosen": {
      "id": "col-1-1785753278797",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    }
  },
  {
    "registrationFeeTND": 0,
    "id": "RES-2026-1119",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "ville": "Sfax",
        "telephone": "98413435",
        "cin": "01029348",
        "email": "",
        "prenom": "AMOR",
        "adresse": "RUE ANNABA ",
        "nom": "MANSOURI"
      }
    },
    "documents": [
      {
        "fileType": "application/pdf",
        "uploadedAt": "2026-09-23 08:16",
        "name": "AMOR MANSOURI.pdf",
        "id": "doc-1790151376958-imt5",
        "sizeFormatted": "0.47 MB",
        "dataUrl": "",
        "category": "cin_recto"
      }
    ],
    "priceTND": 129900,
    "commercialId": "user-1785739349068",
    "agency": "Chery Agence Sfax",
    "commercialName": "Nader Chtourou",
    "carId": "car-1785513071800",
    "expectedDeliveryDate": "2026-10-23",
    "carName": "Chery Tiggo 9 PHEV (Black CM)",
    "vehicles": [
      {
        "unitPriceTND": 129900,
        "requiredDepositTND": 50000,
        "carId": "car-1785513071800",
        "colorChosen": {
          "hexCode": "#030303",
          "id": "col-1786981421374",
          "name": "Black CM"
        },
        "totalPriceTND": 129900,
        "carName": "Chery Tiggo 9 PHEV",
        "quantity": 1,
        "id": "v-1790151253339"
      }
    ],
    "etaDate": "2026-09-23",
    "colorChosen": {
      "id": "col-1786981421374",
      "name": "Black CM",
      "hexCode": "#030303"
    },
    "depositPaidTND": 50000,
    "updatedAt": "2026-09-23T08:16:19.408Z",
    "notes": "",
    "createdAt": "2026-09-23T08:16:19.408Z",
    "status": "En attente",
    "paymentMethod": "Chèque Certifié"
  },
  {
    "notes": "⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés.",
    "etaDate": "2026-09-22",
    "carName": "Chery Tiggo 4 HEV (Gray GV)",
    "carId": "car-1785753066750",
    "vehicles": [
      {
        "id": "v-1790090595782",
        "carId": "car-1785753066750",
        "carName": "Chery Tiggo 4 HEV",
        "colorChosen": {
          "id": "col-3-1785753066750",
          "name": "Gray GV",
          "hexCode": "#6E6F72"
        },
        "quantity": 1,
        "unitPriceTND": 79900,
        "totalPriceTND": 79900,
        "requiredDepositTND": 20000
      }
    ],
    "id": "RES-2026-1118",
    "documents": [
      {
        "id": "doc-1790090922143-ar41",
        "name": "NOTIFICATION ACCORD STE CHNITI  MEDICAL.pdf",
        "category": "accord_leasing",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.27 MB",
        "uploadedAt": "2026-09-22 15:28"
      },
      {
        "id": "doc-1790091135229-y3n0",
        "name": "RNE ste chntti medical.pdf",
        "category": "registre_commerce",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "1.04 MB",
        "uploadedAt": "2026-09-22 15:32"
      }
    ],
    "commercialId": "comm-marwa",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE CHNITI MEDICAL EQUI",
        "matriculeFiscale": "1743577/c",
        "ville": "Tunis",
        "telephone": "29850547",
        "email": "",
        "adresse": "",
        "registreCommerce": "1743577"
      }
    },
    "expectedDeliveryDate": "2026-10-22",
    "commercialName": "Marwa Frikha",
    "colorChosen": {
      "id": "col-3-1785753066750",
      "name": "Gray GV",
      "hexCode": "#6E6F72"
    },
    "agency": "Siege STA",
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 20000,
    "status": "En attente",
    "updatedAt": "2026-09-22T15:32:55.868Z",
    "registrationFeeTND": 0,
    "createdAt": "2026-09-22T15:32:55.868Z",
    "priceTND": 79900
  },
  {
    "etaDate": "2026-09-22",
    "carName": "Chery Tiggo 4 HEV (Gray GV)",
    "colorChosen": {
      "id": "col-3-1785753066750",
      "name": "Gray GV",
      "hexCode": "#6E6F72"
    },
    "vehicles": [
      {
        "id": "v-1790080643433",
        "carId": "car-1785753066750",
        "carName": "Chery Tiggo 4 HEV",
        "colorChosen": {
          "id": "col-3-1785753066750",
          "name": "Gray GV",
          "hexCode": "#6E6F72"
        },
        "quantity": 1,
        "unitPriceTND": 79900,
        "totalPriceTND": 79900,
        "requiredDepositTND": 20000
      }
    ],
    "documents": [
      {
        "id": "doc-1790080702004-hpzg",
        "name": "CIN.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.08 MB",
        "uploadedAt": "2026-09-22 12:38"
      },
      {
        "id": "doc-1790080702062-d318",
        "name": "VIREMENT.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.12 MB",
        "uploadedAt": "2026-09-22 12:38"
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "MOUROU",
        "prenom": "THOURAYA",
        "cin": "07007673",
        "ville": "Tunis",
        "telephone": "54421338",
        "email": "",
        "adresse": ""
      }
    },
    "expectedDeliveryDate": "2026-10-22",
    "notes": "",
    "commercialId": "user-1787557344213",
    "commercialName": "GODDI CHERY Nabeul",
    "id": "RES-2026-1117",
    "priceTND": 79900,
    "registrationFeeTND": 0,
    "agency": "Chery Agence Nabeul",
    "status": "En attente",
    "depositPaidTND": 5000,
    "createdAt": "2026-09-22T12:38:45.294Z",
    "carId": "car-1785753066750",
    "updatedAt": "2026-09-22T12:38:45.294Z",
    "paymentMethod": "Virement Bancaire"
  },
  {
    "vehicles": [
      {
        "quantity": 1,
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "hexCode": "#FFFFFF",
          "id": "col-1-1785753278797",
          "name": "White BW"
        },
        "unitPriceTND": 88900,
        "id": "v-1790073046006",
        "requiredDepositTND": 30000,
        "totalPriceTND": 88900,
        "carId": "car-1785753278797"
      }
    ],
    "commercialId": "comm-moez",
    "updatedAt": "2026-09-22T10:33:08.518Z",
    "status": "En attente",
    "createdAt": "2026-09-22T10:33:08.518Z",
    "carId": "car-1785753278797",
    "registrationFeeTND": 0,
    "agency": "Siege STA",
    "paymentMethod": "Chèque Certifié",
    "notes": "",
    "carName": "Chery Tiggo 7 PHEV (White BW)",
    "colorChosen": {
      "name": "White BW",
      "hexCode": "#FFFFFF",
      "id": "col-1-1785753278797"
    },
    "etaDate": "2026-09-22",
    "client": {
      "personnePhysique": {
        "nom": "SOUISSI ",
        "adresse": "",
        "telephone": "95172034",
        "prenom": "HALIMA",
        "email": "",
        "ville": "Tunis",
        "cin": "06419090"
      },
      "type": "personne_physique"
    },
    "depositPaidTND": 30000,
    "priceTND": 88900,
    "documents": [
      {
        "category": "cin_recto",
        "name": "IMG_3327.jpeg",
        "dataUrl": "",
        "sizeFormatted": "2.79 MB",
        "uploadedAt": "2026-09-22 10:32",
        "id": "doc-1790073133586-avwq",
        "fileType": "image/jpeg"
      },
      {
        "id": "doc-1790073138195-pv5p",
        "fileType": "image/jpeg",
        "sizeFormatted": "2.60 MB",
        "dataUrl": "",
        "uploadedAt": "2026-09-22 10:32",
        "name": "IMG_3328.jpeg",
        "category": "cin_verso"
      },
      {
        "fileType": "image/jpeg",
        "name": "IMG_3329.jpeg",
        "uploadedAt": "2026-09-22 10:32",
        "id": "doc-1790073163881-8a9e",
        "dataUrl": "",
        "sizeFormatted": "2.66 MB",
        "category": "quittance_acompte"
      },
      {
        "sizeFormatted": "2.66 MB",
        "id": "doc-1790073185345-zjc0",
        "category": "quittance_acompte",
        "dataUrl": "",
        "name": "IMG_3329.jpeg",
        "uploadedAt": "2026-09-22 10:33",
        "fileType": "image/jpeg"
      }
    ],
    "id": "RES-2026-1116",
    "expectedDeliveryDate": "2026-10-22",
    "commercialName": "Moez Ben Naser"
  },
  {
    "etaDate": "2026-09-22",
    "carName": "Chery Tiggo 9 PHEV (Black CM)",
    "documents": [
      {
        "dataUrl": "",
        "sizeFormatted": "0.60 MB",
        "fileType": "image/png",
        "uploadedAt": "2026-09-22 10:15",
        "category": "registre_commerce",
        "id": "doc-1790072121588-0d9e",
        "name": "Capture d'écran 2026-09-22 110122.png"
      },
      {
        "dataUrl": "",
        "fileType": "image/png",
        "name": "Capture d'écran 2026-09-22 105743.png",
        "id": "doc-1790072145748-4u2j",
        "category": "bon_commande",
        "sizeFormatted": "0.57 MB",
        "uploadedAt": "2026-09-22 10:15"
      }
    ],
    "commercialName": "Moez Ben Naser",
    "commercialId": "comm-moez",
    "agency": "Siege STA",
    "registrationFeeTND": 0,
    "depositPaidTND": 50000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "priceTND": 129900,
    "id": "RES-2026-1115",
    "expectedDeliveryDate": "2026-10-22",
    "createdAt": "2026-09-22T10:15:51.938Z",
    "updatedAt": "2026-09-22T10:16:16.797Z",
    "colorChosen": {
      "id": "col-1786981421374",
      "name": "Black CM",
      "hexCode": "#030303"
    },
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "carId": "car-1785513071800",
    "vehicles": [
      {
        "totalPriceTND": 129900,
        "colorChosen": {
          "name": "Black CM",
          "id": "col-1786981421374",
          "hexCode": "#030303"
        },
        "quantity": 1,
        "id": "v-1790071950813",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "requiredDepositTND": 50000,
        "unitPriceTND": 129900
      }
    ],
    "client": {
      "societe": {
        "adresse": "",
        "raisonSociale": "STE AZELEC",
        "registreCommerce": "031440SPM000",
        "matriculeFiscale": "031440SPM000",
        "email": "",
        "ville": "Tunis",
        "telephone": "99921221"
      },
      "type": "societe"
    }
  },
  {
    "documents": [
      {
        "fileType": "application/pdf",
        "notes": " [Pièce jointe archivée]",
        "id": "doc-1790070172394-66l5",
        "sizeFormatted": "0.97 MB",
        "dataUrl": "",
        "name": "NANTISSEMENT SUR VEHICULE BIAT 53 MILLE DT 7 PHEV NOIR NIHEL DRIRA.pdf",
        "uploadedAt": "2026-09-22 09:42",
        "category": "accord_leasing"
      }
    ],
    "commercialName": "DISTRICARS Sfax",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "email": "",
        "telephone": "27900858",
        "prenom": "NIHEL",
        "cin": "08818927",
        "ville": "Sfax",
        "adresse": "SFAX",
        "nom": "DRIRA"
      }
    },
    "expectedDeliveryDate": "2026-10-22",
    "etaDate": "2026-09-22",
    "priceTND": 88900,
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "paymentMethod": "Leasing",
    "depositPaidTND": 0,
    "createdAt": "2026-09-22T09:43:58.301Z",
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "updatedAt": "2026-09-22T09:45:09.188Z",
    "notes": "CI-JOINT LETTRE D'ENGAGEMENT BIAT CREDIT DE 53 MILLE DINARS + NANTISSEMENT SUR VEHICULES SIGNIER  | ⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés.",
    "vehicles": [
      {
        "id": "v-1790070064883",
        "carId": "car-1785753278797",
        "unitPriceTND": 88900,
        "quantity": 1,
        "totalPriceTND": 88900,
        "colorChosen": {
          "id": "col-1786454139529",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "requiredDepositTND": 30000,
        "carName": "Chery Tiggo 7 PHEV"
      }
    ],
    "id": "RES-2026-1114",
    "carId": "car-1785753278797",
    "commercialId": "user-1787557241636",
    "colorChosen": {
      "name": "Black CL",
      "id": "col-1786454139529",
      "hexCode": "#050505"
    },
    "agency": "Chery Agence Sfax"
  },
  {
    "notes": "⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés.",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "requiredDepositTND": 30000,
        "carId": "car-1785753278797",
        "quantity": 1,
        "id": "v-1790065962565",
        "totalPriceTND": 88900,
        "unitPriceTND": 88900,
        "colorChosen": {
          "hexCode": "#050505",
          "id": "col-1786454139529",
          "name": "Black CL"
        },
        "carName": "Chery Tiggo 7 PHEV"
      }
    ],
    "commercialId": "user-1787557462429",
    "paymentMethod": "Leasing",
    "colorChosen": {
      "hexCode": "#050505",
      "id": "col-1786454139529",
      "name": "Black CL"
    },
    "etaDate": "2026-09-22",
    "createdAt": "2026-09-22T08:35:50.186Z",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "AMRI ",
        "telephone": "98552622",
        "prenom": "ABDELKADER",
        "adresse": "RUE SIDI AMER MONASTIR ",
        "ville": "Monastir",
        "cin": "08212507",
        "email": ""
      }
    },
    "id": "RES-2026-1113",
    "updatedAt": "2026-09-22T08:36:14.224Z",
    "carId": "car-1785753278797",
    "expectedDeliveryDate": "2026-10-22",
    "commercialName": "TAGOURTI CHERY Sousse",
    "agency": "Chery Agence Sousse",
    "priceTND": 88900,
    "documents": [
      {
        "uploadedAt": "2026-09-22 08:34",
        "id": "doc-1790066096007-rzok",
        "sizeFormatted": "0.70 MB",
        "category": "cin_verso",
        "notes": " [Pièce jointe archivée]",
        "fileType": "application/pdf",
        "name": "BC.pdf",
        "dataUrl": ""
      },
      {
        "id": "doc-1790066098779-6px7",
        "uploadedAt": "2026-09-22 08:34",
        "category": "cin_verso",
        "fileType": "application/pdf",
        "name": "CIN.pdf",
        "notes": " [Pièce jointe archivée]",
        "sizeFormatted": "0.20 MB",
        "dataUrl": ""
      }
    ],
    "status": "Confirmée",
    "depositPaidTND": 0
  },
  {
    "agency": "Chery Agence Nabeul",
    "carId": "car-1785753150277",
    "expectedDeliveryDate": "2026-10-21",
    "notes": "",
    "priceTND": 76900,
    "documents": [
      {
        "sizeFormatted": "0.06 MB",
        "id": "doc-1790003026650-wfcl",
        "dataUrl": "",
        "uploadedAt": "2026-09-21 15:03",
        "fileType": "application/pdf",
        "category": "cin_recto",
        "name": "CIN.pdf"
      },
      {
        "fileType": "application/pdf",
        "id": "doc-1790003029777-2boe",
        "sizeFormatted": "0.09 MB",
        "uploadedAt": "2026-09-21 15:03",
        "name": "CHEQUE.pdf",
        "category": "cin_recto",
        "dataUrl": ""
      }
    ],
    "status": "Confirmée",
    "id": "RES-2026-1112",
    "registrationFeeTND": 0,
    "carName": "Chery I03 4X2 (Black BL)",
    "etaDate": "2026-09-21",
    "commercialId": "user-1787557344213",
    "commercialName": "GODDI CHERY Nabeul",
    "paymentMethod": "Chèque Certifié",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "ville": "Nabeul",
        "cin": "01772116",
        "email": "",
        "telephone": "52704328",
        "adresse": "",
        "nom": "SFIA",
        "prenom": "ABDELKADER BEN MOHAMED"
      }
    },
    "createdAt": "2026-09-21T15:03:54.951Z",
    "colorChosen": {
      "name": "Black BL",
      "id": "col-1-1785753150277",
      "hexCode": "#171717"
    },
    "updatedAt": "2026-09-21T15:33:34.696Z",
    "vehicles": [
      {
        "carId": "car-1785753150277",
        "unitPriceTND": 76900,
        "colorChosen": {
          "hexCode": "#171717",
          "name": "Black BL",
          "id": "col-1-1785753150277"
        },
        "requiredDepositTND": 20000,
        "totalPriceTND": 76900,
        "quantity": 1,
        "id": "v-1790002963477",
        "carName": "Chery I03 4X2"
      }
    ],
    "depositPaidTND": 20000
  },
  {
    "id": "RES-2026-1111",
    "commercialId": "user-1787557525876",
    "commercialName": "K2EM CHERY Charguia 1",
    "agency": "Chery Agence Charguia 1",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "colorChosen": {
      "id": "col-1786454139529",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "vehicles": [
      {
        "id": "v-1789997587844",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-1786454139529",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900,
        "requiredDepositTND": 30000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Nezih",
        "prenom": "Ben Amara",
        "cin": "09800594",
        "ville": "Tunis",
        "telephone": "93129443",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [
      {
        "id": "doc-1789997710287-5tj3",
        "name": "Nezih Ben Amara.jpeg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.12 MB",
        "uploadedAt": "2026-09-21 13:35"
      },
      {
        "id": "doc-1789998167345-f4ma",
        "name": "BC Amara Nezih.pdf",
        "category": "bon_commande",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.30 MB",
        "uploadedAt": "2026-09-21 13:42"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 0,
    "paymentMethod": "Leasing",
    "status": "Confirmée",
    "createdAt": "2026-09-21T13:47:18.982Z",
    "updatedAt": "2026-09-21T13:47:18.982Z",
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "etaDate": "2026-09-21",
    "expectedDeliveryDate": "2026-10-21"
  },
  {
    "id": "RES-2026-1110",
    "commercialId": "user-1787557344213",
    "commercialName": "GODDI CHERY Nabeul",
    "agency": "Chery Agence Nabeul",
    "carId": "car-1785753367152",
    "carName": "Chery Tiggo 8 PHEV (White BW)",
    "colorChosen": {
      "name": "White BW",
      "id": "col-1-1785753367152",
      "hexCode": "#FFFFFF"
    },
    "vehicles": [
      {
        "totalPriceTND": 102990,
        "id": "v-1789990382351",
        "unitPriceTND": 102990,
        "carId": "car-1785753367152",
        "carName": "Chery Tiggo 8 PHEV",
        "quantity": 1,
        "colorChosen": {
          "hexCode": "#FFFFFF",
          "id": "col-1-1785753367152",
          "name": "White BW"
        },
        "requiredDepositTND": 40000
      }
    ],
    "client": {
      "societe": {
        "raisonSociale": "STE MONDIAL SECURITE DISTRIBUTION 'M.S.D'",
        "telephone": "21040616",
        "email": "",
        "registreCommerce": "",
        "adresse": "",
        "ville": "Tunis",
        "matriculeFiscale": "1354727G"
      },
      "type": "societe"
    },
    "documents": [
      {
        "notes": " [Pièce jointe archivée]",
        "fileType": "application/pdf",
        "uploadedAt": "2026-09-21 11:44",
        "sizeFormatted": "1.28 MB",
        "category": "bon_commande",
        "id": "doc-1789991067647-xikz",
        "name": "BCI + BC LEAS + PV + CONTRAT.pdf",
        "dataUrl": ""
      },
      {
        "id": "doc-1789991067688-4u29",
        "name": "RNE2_260921_121939.pdf",
        "uploadedAt": "2026-09-21 11:44",
        "fileType": "application/pdf",
        "sizeFormatted": "0.14 MB",
        "notes": " [Pièce jointe archivée]",
        "category": "bon_commande",
        "dataUrl": ""
      },
      {
        "category": "bon_commande",
        "notes": " [Pièce jointe archivée]",
        "id": "doc-1789991067733-0drb",
        "dataUrl": "",
        "fileType": "application/pdf",
        "sizeFormatted": "0.32 MB",
        "name": "RNE MARS2025_260921_121902.pdf",
        "uploadedAt": "2026-09-21 11:44"
      }
    ],
    "priceTND": 102990,
    "registrationFeeTND": 0,
    "depositPaidTND": 0,
    "paymentMethod": "Leasing",
    "status": "Confirmée",
    "createdAt": "2026-09-21T11:53:30.312Z",
    "updatedAt": "2026-09-21T11:53:30.312Z",
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "expectedDeliveryDate": "2026-10-21",
    "etaDate": "2026-09-21"
  },
  {
    "id": "RES-2026-1109",
    "commercialId": "user-1787557241636",
    "commercialName": "DISTRICARS Sfax",
    "agency": "Chery Agence Sfax",
    "carId": "car-1785753150277",
    "carName": "Chery I03 4X2 (Black BL)",
    "colorChosen": {
      "id": "col-1-1785753150277",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "vehicles": [
      {
        "id": "v-1789988616909",
        "carId": "car-1785753150277",
        "carName": "Chery I03 4X2",
        "colorChosen": {
          "id": "col-1-1785753150277",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 76900,
        "totalPriceTND": 76900,
        "requiredDepositTND": 20000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "ZGHAL",
        "prenom": "SANA",
        "cin": "11065734",
        "ville": "Sfax",
        "telephone": "21246899",
        "email": "",
        "adresse": "SFAX"
      }
    },
    "documents": [
      {
        "id": "doc-1789988794902-qjln",
        "name": "VIR 20 MILLE DT SANA I03 4X2 NOIR.pdf",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "dataUrl": "",
        "sizeFormatted": "0.53 MB",
        "uploadedAt": "2026-09-21 11:06"
      }
    ],
    "priceTND": 76900,
    "registrationFeeTND": 0,
    "depositPaidTND": 20000,
    "paymentMethod": "Virement Bancaire",
    "status": "Confirmée",
    "createdAt": "2026-09-21T11:07:15.062Z",
    "updatedAt": "2026-09-21T11:07:39.903Z",
    "notes": "LIVRAISON DE STA",
    "expectedDeliveryDate": "2026-10-21",
    "etaDate": "2026-09-21"
  },
  {
    "id": "RES-2026-1108",
    "commercialId": "comm-moez",
    "commercialName": "Moez Ben Naser",
    "agency": "Siege STA",
    "carId": "car-1785753150277",
    "carName": "Chery I03 4X2 (Black BL)",
    "colorChosen": {
      "hexCode": "#171717",
      "id": "col-1-1785753150277",
      "name": "Black BL"
    },
    "vehicles": [
      {
        "unitPriceTND": 76900,
        "colorChosen": {
          "hexCode": "#171717",
          "id": "col-1-1785753150277",
          "name": "Black BL"
        },
        "id": "v-1789987985199",
        "carId": "car-1785753150277",
        "totalPriceTND": 76900,
        "requiredDepositTND": 20000,
        "quantity": 1,
        "carName": "Chery I03 4X2"
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "email": "",
        "ville": "Tunis",
        "prenom": "NABIL",
        "adresse": "",
        "cin": "00758713",
        "nom": "BEN LARBI",
        "telephone": "95992992"
      }
    },
    "documents": [
      {
        "dataUrl": "",
        "fileType": "image/jpeg",
        "category": "cin_recto",
        "name": "IMG_3307.jpeg",
        "uploadedAt": "2026-09-21 10:54",
        "id": "doc-1789988098139-1giy",
        "sizeFormatted": "2.72 MB"
      },
      {
        "dataUrl": "",
        "sizeFormatted": "2.77 MB",
        "name": "IMG_3308.jpeg",
        "fileType": "image/jpeg",
        "id": "doc-1789988102761-yap3",
        "category": "cin_verso",
        "uploadedAt": "2026-09-21 10:55"
      },
      {
        "sizeFormatted": "2.96 MB",
        "category": "quittance_acompte",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "uploadedAt": "2026-09-21 10:55",
        "name": "IMG_3306.jpeg",
        "id": "doc-1789988108749-rthu"
      }
    ],
    "priceTND": 76900,
    "registrationFeeTND": 0,
    "depositPaidTND": 20000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-21T10:55:12.253Z",
    "updatedAt": "2026-09-21T10:55:41.916Z",
    "notes": "",
    "expectedDeliveryDate": "2026-10-21",
    "etaDate": "2026-09-21"
  },
  {
    "id": "RES-2026-1107",
    "commercialId": "user-1787557525876",
    "commercialName": "K2EM CHERY Charguia 1",
    "agency": "Chery Agence Charguia 1",
    "carId": "car-1785753208837",
    "carName": "Chery I03 4X4 (Black BL)",
    "colorChosen": {
      "id": "col-1-1785753208837",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "vehicles": [
      {
        "requiredDepositTND": 20000,
        "colorChosen": {
          "id": "col-1-1785753208837",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "unitPriceTND": 84900,
        "totalPriceTND": 84900,
        "carName": "Chery I03 4X4",
        "carId": "car-1785753208837",
        "id": "v-1789987960094",
        "quantity": 1
      }
    ],
    "client": {
      "type": "societe",
      "societe": {
        "adresse": "",
        "registreCommerce": "",
        "telephone": "70106200",
        "matriculeFiscale": "1142846L",
        "ville": "Tunis",
        "email": "",
        "raisonSociale": "Sté ADELEC"
      }
    },
    "documents": [
      {
        "name": "RNE ADELEC INTER LE 09.09.2026.pdf",
        "uploadedAt": "2026-09-21 10:53",
        "dataUrl": "",
        "id": "doc-1789987998941-elac",
        "sizeFormatted": "0.26 MB",
        "category": "cin_recto",
        "fileType": "application/pdf"
      },
      {
        "category": "bon_commande",
        "id": "doc-1789988006062-xizw",
        "fileType": "application/pdf",
        "name": "BC CHERY I03 4X4.pdf",
        "uploadedAt": "2026-09-21 10:53",
        "sizeFormatted": "0.15 MB",
        "dataUrl": ""
      }
    ],
    "priceTND": 84900,
    "registrationFeeTND": 0,
    "depositPaidTND": 0,
    "paymentMethod": "Leasing",
    "status": "Confirmée",
    "createdAt": "2026-09-21T10:53:35.090Z",
    "updatedAt": "2026-09-21T10:53:35.090Z",
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "etaDate": "2026-09-21",
    "expectedDeliveryDate": "2026-10-21"
  },
  {
    "id": "RES-2026-1101",
    "commercialId": "comm-hanen",
    "commercialName": "Hanen Gharbi",
    "agency": "Chery Agence Ain Zaghouen",
    "carId": "car-1785513071800",
    "carName": "Chery Tiggo 9 PHEV",
    "colorChosen": {
      "id": "col-3-1785513071800",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-1101-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-3-1785513071800",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE MEDITERRANEENNE DE COMMERCE",
        "matriculeFiscale": "1234567/A/P/000",
        "ville": "Tunis",
        "telephone": "+216 71 920 800",
        "email": "direction@medcommerce.tn",
        "adresse": "Les Berges du Lac 2, Tunis"
      }
    },
    "documents": [],
    "priceTND": 129900,
    "registrationFeeTND": 0,
    "depositPaidTND": 50000,
    "paymentMethod": "Dossier Bancaire",
    "status": "Confirmée",
    "createdAt": "2026-09-21T09:30:00.000Z",
    "updatedAt": "2026-09-21T09:30:00.000Z",
    "notes": "Dossier crédit bancaire validé, acompte 25 000 DT comptabilisé"
  },
  {
    "id": "RES-2026-1106",
    "commercialId": "user-1787821380306",
    "commercialName": "Racha Jebeniani",
    "agency": "Chery siege",
    "carId": "car-1785513071800",
    "carName": "Chery Tiggo 9 PHEV (Tech Gray GX)",
    "colorChosen": {
      "id": "col-3-1785513071800",
      "hexCode": "#727783",
      "name": "Tech Gray GX"
    },
    "vehicles": [
      {
        "requiredDepositTND": 50000,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900,
        "id": "v-1789980720768",
        "carId": "car-1785513071800",
        "quantity": 1,
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "name": "Tech Gray GX",
          "hexCode": "#727783",
          "id": "col-3-1785513071800"
        }
      }
    ],
    "client": {
      "personnePhysique": {
        "ville": "Mahdia",
        "telephone": "26468202",
        "adresse": "",
        "email": "",
        "nom": "TRABELSI",
        "cin": "07391940",
        "prenom": "KHALED"
      },
      "type": "personne_physique"
    },
    "documents": [
      {
        "category": "cin_recto",
        "fileType": "application/pdf",
        "name": "cin khaled.pdf",
        "id": "doc-1789980780997-5wch",
        "dataUrl": "",
        "notes": " [Pièce jointe archivée]",
        "sizeFormatted": "2.19 MB",
        "uploadedAt": "2026-09-21 08:53"
      },
      {
        "uploadedAt": "2026-09-21 08:53",
        "fileType": "application/pdf",
        "category": "cin_verso",
        "notes": " [Pièce jointe archivée]",
        "name": "VERSO CIN KHALED.pdf",
        "id": "doc-1789980786042-dji9",
        "sizeFormatted": "1.44 MB",
        "dataUrl": ""
      },
      {
        "fileType": "application/pdf",
        "category": "quittance_acompte",
        "sizeFormatted": "0.72 MB",
        "notes": " [Pièce jointe archivée]",
        "id": "doc-1789980789534-0xgp",
        "dataUrl": "",
        "name": "CHEQUE KHALED.pdf",
        "uploadedAt": "2026-09-21 08:53"
      },
      {
        "uploadedAt": "2026-09-21 08:53",
        "id": "doc-1789980796067-yzfa",
        "category": "autre",
        "fileType": "application/pdf",
        "notes": " [Pièce jointe archivée]",
        "dataUrl": "",
        "name": "QT KHALED.pdf",
        "sizeFormatted": "5.17 MB"
      }
    ],
    "priceTND": 129900,
    "registrationFeeTND": 0,
    "depositPaidTND": 50000,
    "paymentMethod": "Chèque Certifié",
    "status": "En attente",
    "createdAt": "2026-09-21T08:53:21.307Z",
    "updatedAt": "2026-09-21T08:53:21.307Z",
    "notes": "",
    "expectedDeliveryDate": "2026-10-21",
    "etaDate": "2026-09-21"
  },
  {
    "id": "RES-2026-1105",
    "commercialId": "user-1787557344213",
    "commercialName": "GODDI CHERY Nabeul",
    "agency": "Chery Agence Nabeul",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "colorChosen": {
      "name": "Black CL",
      "id": "col-1786454139529",
      "hexCode": "#050505"
    },
    "vehicles": [
      {
        "carName": "Chery Tiggo 7 PHEV",
        "requiredDepositTND": 30000,
        "id": "v-1789980292629",
        "colorChosen": {
          "hexCode": "#050505",
          "id": "col-1786454139529",
          "name": "Black CL"
        },
        "totalPriceTND": 88900,
        "unitPriceTND": 88900,
        "carId": "car-1785753278797",
        "quantity": 1
      }
    ],
    "client": {
      "personnePhysique": {
        "email": "",
        "nom": "BEN ISMAIL",
        "cin": "15007057",
        "prenom": "SAIDA",
        "telephone": "50156649",
        "adresse": "",
        "ville": "Tunis"
      },
      "type": "personne_physique"
    },
    "documents": [
      {
        "name": "Bon de Commande.pdf",
        "uploadedAt": "2026-09-21 08:45",
        "id": "doc-1789980334508-r5gp",
        "fileType": "application/pdf",
        "category": "cin_recto",
        "dataUrl": "",
        "sizeFormatted": "0.10 MB"
      },
      {
        "sizeFormatted": "0.19 MB",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "uploadedAt": "2026-09-21 08:45",
        "id": "doc-1789980334658-fmqj",
        "dataUrl": "",
        "name": "CIN.pdf"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 0,
    "paymentMethod": "Leasing",
    "status": "Confirmée",
    "createdAt": "2026-09-21T08:45:46.229Z",
    "updatedAt": "2026-09-21T08:45:46.229Z",
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "expectedDeliveryDate": "2026-10-21",
    "etaDate": "2026-09-21"
  },
  {
    "id": "RES-2026-1104",
    "commercialId": "user-1787557344213",
    "commercialName": "GODDI CHERY Nabeul",
    "agency": "Chery Agence Nabeul",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "colorChosen": {
      "hexCode": "#050505",
      "name": "Black CL",
      "id": "col-1786454139529"
    },
    "vehicles": [
      {
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-1786454139529",
          "hexCode": "#050505",
          "name": "Black CL"
        },
        "id": "v-1789979929897",
        "totalPriceTND": 88900,
        "carId": "car-1785753278797",
        "requiredDepositTND": 30000,
        "quantity": 1,
        "unitPriceTND": 88900
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "adresse": "",
        "email": "",
        "prenom": "ZEINEB",
        "telephone": "24393935",
        "cin": "07492622",
        "nom": "BOUKHRISS",
        "ville": "Tunis"
      }
    },
    "documents": [
      {
        "category": "cin_recto",
        "fileType": "application/pdf",
        "name": "cin.pdf",
        "id": "doc-1789979998766-awm8",
        "uploadedAt": "2026-09-21 08:39",
        "sizeFormatted": "0.14 MB",
        "dataUrl": ""
      },
      {
        "dataUrl": "",
        "uploadedAt": "2026-09-21 08:40",
        "sizeFormatted": "0.11 MB",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "id": "doc-1789980023346-eldh",
        "name": "Bon de Commande.pdf"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 0,
    "paymentMethod": "Leasing",
    "status": "Confirmée",
    "createdAt": "2026-09-21T08:40:33.852Z",
    "updatedAt": "2026-09-21T08:40:33.852Z",
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "expectedDeliveryDate": "2026-10-21",
    "etaDate": "2026-09-21"
  },
  {
    "id": "RES-2026-1103",
    "commercialId": "user-1787557525876",
    "commercialName": "K2EM CHERY Charguia 1",
    "agency": "Chery Agence Charguia 1",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
    "colorChosen": {
      "id": "col-2-1785753278797",
      "hexCode": "#939AA5",
      "name": "Phantom Gray GV"
    },
    "vehicles": [
      {
        "id": "v-1789979396049",
        "unitPriceTND": 88900,
        "colorChosen": {
          "id": "col-2-1785753278797",
          "hexCode": "#939AA5",
          "name": "Phantom Gray GV"
        },
        "totalPriceTND": 88900,
        "quantity": 1,
        "carName": "Chery Tiggo 7 PHEV",
        "carId": "car-1785753278797",
        "requiredDepositTND": 30000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "email": "",
        "adresse": "",
        "prenom": "El Mahdi",
        "telephone": "98950598",
        "ville": "Tunis",
        "nom": "El Tounsi Omm Ezzine",
        "cin": "08327787"
      }
    },
    "documents": [
      {
        "sizeFormatted": "0.09 MB",
        "id": "doc-1789979542349-n5ro",
        "name": "Mehdi Recto.pdf",
        "dataUrl": "",
        "uploadedAt": "2026-09-21 08:32",
        "fileType": "application/pdf",
        "category": "cin_recto"
      },
      {
        "uploadedAt": "2026-09-21 08:32",
        "category": "cin_verso",
        "fileType": "application/pdf",
        "id": "doc-1789979554460-f1kg",
        "name": "Mehdi Verso.pdf",
        "sizeFormatted": "0.09 MB",
        "dataUrl": ""
      },
      {
        "uploadedAt": "2026-09-21 08:33",
        "id": "doc-1789979621833-75x8",
        "category": "quittance_acompte",
        "fileType": "image/jpeg",
        "sizeFormatted": "0.28 MB",
        "name": "virement.jpeg",
        "dataUrl": ""
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 30000,
    "paymentMethod": "Virement Bancaire",
    "status": "Confirmée",
    "createdAt": "2026-09-21T08:34:23.243Z",
    "updatedAt": "2026-09-21T08:34:32.545Z",
    "notes": "",
    "etaDate": "2026-09-21",
    "expectedDeliveryDate": "2026-10-21"
  },
  {
    "id": "RES-2026-1102",
    "commercialId": "comm-marwa",
    "commercialName": "Marwa Frikha",
    "agency": "Siege STA",
    "carId": "car-1785753208837",
    "carName": "Chery I03 4X4 (Gray GY)",
    "colorChosen": {
      "name": "Gray GY",
      "hexCode": "#626a68",
      "id": "col-1786454499484"
    },
    "vehicles": [
      {
        "requiredDepositTND": 20000,
        "colorChosen": {
          "id": "col-1786454499484",
          "hexCode": "#626a68",
          "name": "Gray GY"
        },
        "id": "v-1789971637030",
        "carName": "Chery I03 4X4",
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900,
        "carId": "car-1785753208837"
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "prenom": "ABDELRAOUEF",
        "nom": "BOUYAHI",
        "cin": "09995176",
        "ville": "Tunis",
        "adresse": "",
        "telephone": "96900330",
        "email": ""
      }
    },
    "documents": [
      {
        "dataUrl": "",
        "sizeFormatted": "2.85 MB",
        "id": "doc-1789971783095-pkfp",
        "name": "17899717677395132965101067088188.jpg",
        "fileType": "image/jpeg",
        "category": "cin_recto",
        "uploadedAt": "2026-09-21 06:23"
      },
      {
        "dataUrl": "",
        "name": "17899717877401454793160401512711.jpg",
        "id": "doc-1789971795826-f31v",
        "sizeFormatted": "2.62 MB",
        "fileType": "image/jpeg",
        "category": "cin_verso",
        "uploadedAt": "2026-09-21 06:23"
      },
      {
        "fileType": "image/jpeg",
        "category": "quittance_acompte",
        "name": "17899718348671228850471611347841.jpg",
        "dataUrl": "",
        "uploadedAt": "2026-09-21 06:24",
        "sizeFormatted": "3.12 MB",
        "id": "doc-1789971846977-22n9"
      }
    ],
    "priceTND": 84900,
    "registrationFeeTND": 0,
    "depositPaidTND": 20000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-21T06:24:13.106Z",
    "updatedAt": "2026-09-21T06:25:32.276Z",
    "notes": "",
    "expectedDeliveryDate": "2026-10-21",
    "etaDate": "2026-09-21"
  },
  {
    "id": "RES-2026-1100",
    "commercialId": "user-1787557525876",
    "commercialName": "K2EM CHERY Charguia 1",
    "agency": "Chery Agence Charguia 1",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Tech Gray GX)",
    "colorChosen": {
      "id": "col-3-1785753278797",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "vehicles": [
      {
        "requiredDepositTND": 30000,
        "quantity": 1,
        "totalPriceTND": 88900,
        "colorChosen": {
          "id": "col-3-1785753278797",
          "hexCode": "#727783",
          "name": "Tech Gray GX"
        },
        "id": "v-1789725938242",
        "carId": "car-1785753278797",
        "unitPriceTND": 88900,
        "carName": "Chery Tiggo 7 PHEV"
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "cin": "04699497",
        "email": "",
        "telephone": "26461232",
        "adresse": "",
        "ville": "Tunis",
        "nom": "El Fetni ",
        "prenom": "Raouf"
      }
    },
    "documents": [
      {
        "sizeFormatted": "0.11 MB",
        "dataUrl": "",
        "uploadedAt": "2026-09-18 10:23",
        "fileType": "application/pdf",
        "category": "cin_recto",
        "id": "doc-1789727002858-07tt",
        "name": "Raouf fetni recto.pdf"
      },
      {
        "sizeFormatted": "0.11 MB",
        "dataUrl": "",
        "id": "doc-1789727008458-tssk",
        "uploadedAt": "2026-09-18 10:23",
        "name": "Raouf fetni verso.pdf",
        "fileType": "application/pdf",
        "category": "cin_verso"
      },
      {
        "id": "doc-1789727021666-1kd7",
        "sizeFormatted": "0.20 MB",
        "uploadedAt": "2026-09-18 10:23",
        "name": "BC Raouf El Fetni.pdf",
        "dataUrl": "",
        "category": "bon_commande",
        "fileType": "application/pdf"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 0,
    "paymentMethod": "Leasing",
    "status": "Confirmée",
    "createdAt": "2026-09-18T10:24:08.581Z",
    "updatedAt": "2026-09-18T10:24:08.581Z",
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "etaDate": "2026-09-18",
    "expectedDeliveryDate": "2026-10-18"
  },
  {
    "id": "RES-2026-1099",
    "commercialId": "user-1785739349068",
    "commercialName": "Nader Chtourou",
    "agency": "Chery Agence Sfax",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
    "colorChosen": {
      "name": "Phantom Gray GV",
      "id": "col-2-1785753278797",
      "hexCode": "#939AA5"
    },
    "vehicles": [
      {
        "requiredDepositTND": 30000,
        "carName": "Chery Tiggo 7 PHEV",
        "id": "v-1789725210414",
        "carId": "car-1785753278797",
        "unitPriceTND": 88900,
        "colorChosen": {
          "id": "col-2-1785753278797",
          "hexCode": "#939AA5",
          "name": "Phantom Gray GV"
        },
        "quantity": 1,
        "totalPriceTND": 88900
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "prenom": "MOHSEN",
        "ville": "Sfax",
        "cin": "01023450",
        "nom": "KILANI",
        "adresse": "ROUTE SOUKRA",
        "email": "",
        "telephone": "98412395"
      }
    },
    "documents": [],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 30000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-18T09:56:01.057Z",
    "updatedAt": "2026-09-18T09:56:19.989Z",
    "notes": "",
    "etaDate": "2026-09-18",
    "expectedDeliveryDate": "2026-10-18"
  },
  {
    "id": "RES-2026-1097",
    "commercialId": "comm-moez",
    "commercialName": "Moez Ben Naser",
    "agency": "Siege STA",
    "carId": "car-1785513071800",
    "carName": "Chery Tiggo 9 PHEV (Huanyu Gray)",
    "colorChosen": {
      "id": "col-1786981512703",
      "name": "Huanyu Gray",
      "hexCode": "#A1A1A1"
    },
    "vehicles": [
      {
        "id": "v-1789721972268",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-1786981512703",
          "name": "Huanyu Gray",
          "hexCode": "#A1A1A1"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900,
        "requiredDepositTND": 50000
      }
    ],
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "SAIDY ENERGY",
        "matriculeFiscale": "1992066T",
        "ville": "Tunis",
        "telephone": "27808729",
        "email": "",
        "adresse": "",
        "registreCommerce": "1992066T"
      }
    },
    "documents": [
      {
        "id": "doc-1789722065590-e8t1",
        "name": "IMG_3277.jpeg",
        "category": "registre_commerce",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.24 MB",
        "uploadedAt": "2026-09-18 09:01"
      },
      {
        "id": "doc-1789722117424-we1z",
        "name": "IMG_3278.jpeg",
        "category": "quittance_acompte",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.81 MB",
        "uploadedAt": "2026-09-18 09:01"
      },
      {
        "id": "doc-1789722122151-gt53",
        "name": "IMG_3279.jpeg",
        "category": "quittance_acompte",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "1.15 MB",
        "uploadedAt": "2026-09-18 09:02"
      }
    ],
    "priceTND": 129900,
    "registrationFeeTND": 0,
    "depositPaidTND": 50000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-18T09:02:26.178Z",
    "updatedAt": "2026-09-18T09:03:45.229Z",
    "notes": "",
    "etaDate": "2026-09-18",
    "expectedDeliveryDate": "2026-10-18"
  },
  {
    "createdAt": "2026-09-18T08:34:54.761Z",
    "commercialName": "LCA CHERY Djerba",
    "vehicles": [
      {
        "id": "veh-RES-2026-992-0",
        "carId": "car-1785753150277",
        "carName": "Chery I03 4X2",
        "colorChosen": {
          "id": "col-RES-2026-992",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 76900,
        "totalPriceTND": 76900
      }
    ],
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-992)",
    "agency": "Chery Agence Djerba",
    "commercialId": "user-1787557295837",
    "expectedDeliveryDate": "2026-10-10",
    "documents": [],
    "carId": "car-1785753150277",
    "registrationFeeTND": 0,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "98815582",
        "email": "",
        "adresse": ""
      }
    },
    "etaDate": "2026-09-10",
    "carName": "Chery I03 4X2",
    "id": "RES-2026-992",
    "priceTND": 76900,
    "depositPaidTND": 7690,
    "colorChosen": {
      "id": "col-RES-2026-992",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "updatedAt": "2026-09-18T08:34:54.761Z"
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-995)",
    "expectedDeliveryDate": "2026-10-10",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "20400883",
        "email": "",
        "adresse": ""
      }
    },
    "commercialName": "LCA CHERY Djerba",
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-995",
      "name": "Phantom Gray GV",
      "hexCode": "#727783"
    },
    "priceTND": 88900,
    "createdAt": "2026-09-18T08:34:44.331Z",
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-09-10",
    "vehicles": [
      {
        "id": "veh-RES-2026-995-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-995",
          "name": "Phantom Gray GV",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "commercialId": "user-1787557295837",
    "id": "RES-2026-995",
    "depositPaidTND": 8890,
    "carId": "car-1785753278797",
    "documents": [],
    "agency": "Chery Agence Djerba",
    "updatedAt": "2026-09-18T08:34:44.331Z"
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1078)",
    "registrationFeeTND": 0,
    "documents": [],
    "commercialId": "comm-moez",
    "paymentMethod": "Chèque Certifié",
    "updatedAt": "2026-09-18T07:48:31.166Z",
    "commercialName": "Moez Ben Naser",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "52268998",
        "email": "",
        "adresse": ""
      }
    },
    "expectedDeliveryDate": "2026-10-16",
    "priceTND": 84900,
    "createdAt": "2026-09-18T07:48:31.166Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-1078-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4 (Black BL)",
        "colorChosen": {
          "id": "col-RES-2026-1078",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "depositPaidTND": 8490,
    "agency": "Siege STA",
    "id": "RES-2026-1078",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-1078",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "carId": "car-1785753208837",
    "etaDate": "2026-09-16",
    "carName": "Chery I03 4X4 (Black BL)"
  },
  {
    "depositPaidTND": 8890,
    "commercialId": "comm-moez",
    "agency": "Siege STA",
    "registrationFeeTND": 0,
    "documents": [],
    "id": "RES-2026-1075",
    "carId": "car-1785753278797",
    "status": "Confirmée",
    "updatedAt": "2026-09-18T07:48:17.934Z",
    "paymentMethod": "Chèque Certifié",
    "priceTND": 88900,
    "etaDate": "2026-09-16",
    "carName": "Chery Tiggo 7 PHEV (White BW)",
    "vehicles": [
      {
        "id": "veh-RES-2026-1075-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (White BW)",
        "colorChosen": {
          "id": "col-RES-2026-1075",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "createdAt": "2026-09-18T07:48:17.934Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1075)",
    "colorChosen": {
      "id": "col-RES-2026-1075",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "commercialName": "Moez Ben Naser",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "29972672",
        "email": "",
        "adresse": ""
      }
    },
    "expectedDeliveryDate": "2026-10-16"
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1045)",
    "status": "Confirmée",
    "createdAt": "2026-09-18T07:38:15.621Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-1045-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV (Black CM)",
        "colorChosen": {
          "id": "col-RES-2026-1045",
          "name": "Black CM",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "registrationFeeTND": 0,
    "commercialName": "TAGOURTI CHERY Sousse",
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery Agence Sousse",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sousse",
        "telephone": "96196367",
        "email": "",
        "adresse": ""
      }
    },
    "carName": "Chery Tiggo 9 PHEV (Black CM)",
    "etaDate": "2026-09-14",
    "expectedDeliveryDate": "2026-10-14",
    "documents": [],
    "depositPaidTND": 12990,
    "priceTND": 129900,
    "commercialId": "user-1787557462429",
    "colorChosen": {
      "id": "col-RES-2026-1045",
      "name": "Black CM",
      "hexCode": "#727783"
    },
    "updatedAt": "2026-09-18T07:38:15.621Z",
    "id": "RES-2026-1045",
    "carId": "car-1785513071800"
  },
  {
    "id": "RES-2026-1098",
    "commercialId": "comm-marwa",
    "commercialName": "Marwa Frikha",
    "agency": "Siege STA",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
    "colorChosen": {
      "id": "col-2-1785753278797",
      "name": "Phantom Gray GV",
      "hexCode": "#939AA5"
    },
    "vehicles": [
      {
        "id": "v-1789713227204",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-2-1785753278797",
          "name": "Phantom Gray GV",
          "hexCode": "#939AA5"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900,
        "requiredDepositTND": 30000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "BEJI ",
        "prenom": "SADREDDINE",
        "cin": "03777404",
        "ville": "Kef",
        "telephone": "98237412",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [
      {
        "id": "doc-1789713387220-hwq4",
        "name": "17897133651786211877807677664664.jpg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "4.89 MB",
        "uploadedAt": "2026-09-18 06:36"
      },
      {
        "id": "doc-1789713398259-v1zy",
        "name": "17897133909517747857873345356068.jpg",
        "category": "cin_verso",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "2.64 MB",
        "uploadedAt": "2026-09-18 06:36"
      },
      {
        "id": "doc-1789713426855-cx48",
        "name": "17897134146123791148426939174787.jpg",
        "category": "virement_bancaire",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "2.30 MB",
        "uploadedAt": "2026-09-18 06:37"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 30000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-18T06:37:25.802Z",
    "updatedAt": "2026-09-18T06:37:47.935Z",
    "notes": "",
    "expectedDeliveryDate": "2026-10-18",
    "etaDate": "2026-09-18"
  },
  {
    "documents": [],
    "commercialId": "user-1785739349068",
    "depositPaidTND": 8890,
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "agency": "Chery Agence Sfax",
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-09-09",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-425)",
    "createdAt": "2026-09-17T13:58:38.722Z",
    "carId": "car-1785753278797",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "54783500",
        "email": "",
        "adresse": ""
      }
    },
    "commercialName": "Nader Chtourou",
    "id": "RES-2026-425",
    "colorChosen": {
      "id": "col-RES-2026-425",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "priceTND": 88900,
    "expectedDeliveryDate": "2026-10-09",
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "id": "veh-RES-2026-425-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-425",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-17T13:58:38.722Z"
  },
  {
    "status": "Confirmée",
    "createdAt": "2026-09-17T13:58:35.830Z",
    "agency": "Chery Agence Sfax",
    "commercialName": "Nader Chtourou",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-991)",
    "priceTND": 88900,
    "etaDate": "2026-09-09",
    "carName": "Chery Tiggo 7 PHEV",
    "carId": "car-1785753278797",
    "expectedDeliveryDate": "2026-10-09",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "99401735",
        "email": "",
        "adresse": ""
      }
    },
    "depositPaidTND": 8890,
    "id": "RES-2026-991",
    "paymentMethod": "Chèque Certifié",
    "documents": [],
    "colorChosen": {
      "id": "col-RES-2026-991",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "commercialId": "user-1785739349068",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-991-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-991",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-17T13:58:35.830Z"
  },
  {
    "carId": "car-1785753278797",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "21383140",
        "email": "",
        "adresse": ""
      }
    },
    "commercialName": "Nader Chtourou",
    "etaDate": "2026-09-09",
    "carName": "Chery Tiggo 7 PHEV",
    "expectedDeliveryDate": "2026-10-09",
    "createdAt": "2026-09-17T13:58:33.420Z",
    "priceTND": 88900,
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-123",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "id": "RES-2026-123",
    "depositPaidTND": 8890,
    "status": "Confirmée",
    "agency": "Chery Agence Sfax",
    "commercialId": "user-1785739349068",
    "registrationFeeTND": 0,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-123)",
    "documents": [],
    "vehicles": [
      {
        "id": "veh-RES-2026-123-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-123",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-17T13:58:33.420Z"
  },
  {
    "commercialId": "user-1785739349068",
    "agency": "Chery Agence Sfax",
    "expectedDeliveryDate": "2026-10-09",
    "createdAt": "2026-09-17T13:58:30.651Z",
    "etaDate": "2026-09-09",
    "carName": "Chery Tiggo 7 PHEV",
    "carId": "car-1785753278797",
    "id": "RES-2026-863",
    "registrationFeeTND": 0,
    "depositPaidTND": 8890,
    "status": "Confirmée",
    "documents": [],
    "priceTND": 88900,
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-863",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "commercialName": "Nader Chtourou",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-863)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "51770877",
        "email": "",
        "adresse": ""
      }
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-863-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-863",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-17T13:58:30.651Z"
  },
  {
    "agency": "Chery Agence Sfax",
    "commercialName": "Nader Chtourou",
    "etaDate": "2026-09-09",
    "carName": "Chery Tiggo 7 PHEV",
    "registrationFeeTND": 0,
    "commercialId": "user-1785739349068",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-731)",
    "documents": [],
    "status": "Confirmée",
    "priceTND": 88900,
    "id": "RES-2026-731",
    "carId": "car-1785753278797",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-17T13:58:25.172Z",
    "expectedDeliveryDate": "2026-10-09",
    "colorChosen": {
      "id": "col-RES-2026-731",
      "name": "Exclusive Blue WE",
      "hexCode": "#727783"
    },
    "depositPaidTND": 8890,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "98401343",
        "email": "",
        "adresse": ""
      }
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-731-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-731",
          "name": "Exclusive Blue WE",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-17T13:58:25.172Z"
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-793)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "97267549",
        "email": "",
        "adresse": ""
      }
    },
    "commercialId": "user-1785739349068",
    "registrationFeeTND": 0,
    "expectedDeliveryDate": "2026-10-09",
    "createdAt": "2026-09-17T13:58:22.459Z",
    "commercialName": "Nader Chtourou",
    "status": "Confirmée",
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 8490,
    "carName": "Chery I03 4X4",
    "etaDate": "2026-09-09",
    "colorChosen": {
      "id": "col-RES-2026-793",
      "name": "Silver SL",
      "hexCode": "#727783"
    },
    "priceTND": 84900,
    "documents": [],
    "id": "RES-2026-793",
    "carId": "car-1785753208837",
    "agency": "Chery Agence Sfax",
    "vehicles": [
      {
        "id": "veh-RES-2026-793-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-793",
          "name": "Silver SL",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-17T13:58:22.459Z"
  },
  {
    "agency": "Chery Agence Sfax",
    "documents": [],
    "priceTND": 76900,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-806)",
    "status": "Confirmée",
    "commercialName": "Nader Chtourou",
    "registrationFeeTND": 0,
    "colorChosen": {
      "id": "col-RES-2026-806",
      "name": "Silver SL",
      "hexCode": "#727783"
    },
    "commercialId": "user-1785739349068",
    "id": "RES-2026-806",
    "depositPaidTND": 7690,
    "paymentMethod": "Chèque Certifié",
    "expectedDeliveryDate": "2026-10-09",
    "createdAt": "2026-09-17T13:58:18.558Z",
    "carId": "car-1785753150277",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "25005800",
        "email": "",
        "adresse": ""
      }
    },
    "etaDate": "2026-09-09",
    "carName": "Chery I03 4X2",
    "vehicles": [
      {
        "id": "veh-RES-2026-806-0",
        "carId": "car-1785753150277",
        "carName": "Chery I03 4X2",
        "colorChosen": {
          "id": "col-RES-2026-806",
          "name": "Silver SL",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 76900,
        "totalPriceTND": 76900
      }
    ],
    "updatedAt": "2026-09-17T13:58:18.558Z"
  },
  {
    "priceTND": 76900,
    "depositPaidTND": 7690,
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "agency": "Chery Agence Sfax",
    "colorChosen": {
      "id": "col-RES-2026-137",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "createdAt": "2026-09-17T13:58:12.337Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-137)",
    "paymentMethod": "Chèque Certifié",
    "etaDate": "2026-09-10",
    "carName": "Chery I03 4X2",
    "expectedDeliveryDate": "2026-10-10",
    "carId": "car-1785753150277",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "50666456",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "commercialId": "user-1785739349068",
    "id": "RES-2026-137",
    "commercialName": "Nader Chtourou",
    "vehicles": [
      {
        "id": "veh-RES-2026-137-0",
        "carId": "car-1785753150277",
        "carName": "Chery I03 4X2",
        "colorChosen": {
          "id": "col-RES-2026-137",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 76900,
        "totalPriceTND": 76900
      }
    ],
    "updatedAt": "2026-09-17T13:58:12.337Z"
  },
  {
    "status": "Confirmée",
    "commercialName": "Nader Chtourou",
    "id": "RES-2026-1004",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1004)",
    "agency": "Chery Agence Sfax",
    "priceTND": 84900,
    "createdAt": "2026-09-17T13:58:09.733Z",
    "colorChosen": {
      "id": "col-RES-2026-1004",
      "name": "Green GN",
      "hexCode": "#727783"
    },
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "id": "veh-RES-2026-1004-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4 (Green GN)",
        "colorChosen": {
          "id": "col-RES-2026-1004",
          "name": "Green GN",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-17T13:58:09.733Z",
    "carId": "car-1785753208837",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "",
        "email": "",
        "adresse": ""
      }
    },
    "carName": "Chery I03 4X4 (Green GN)",
    "commercialId": "user-1785739349068",
    "depositPaidTND": 8490,
    "registrationFeeTND": 0,
    "documents": []
  },
  {
    "commercialName": "Nader Chtourou",
    "id": "RES-2026-1096",
    "status": "Confirmée",
    "carId": "car-1785753278797",
    "updatedAt": "2026-09-17T13:57:52.822Z",
    "colorChosen": {
      "id": "col-RES-2026-1096",
      "name": "Phantom Gray GV",
      "hexCode": "#727783"
    },
    "agency": "Chery Agence Sfax",
    "priceTND": 88900,
    "documents": [],
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-1096-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
        "colorChosen": {
          "id": "col-RES-2026-1096",
          "name": "Phantom Gray GV",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "54501120",
        "email": "",
        "adresse": ""
      }
    },
    "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
    "commercialId": "user-1785739349068",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1096)",
    "createdAt": "2026-09-17T13:57:52.822Z",
    "depositPaidTND": 8890,
    "paymentMethod": "Chèque Certifié"
  },
  {
    "depositPaidTND": 7990,
    "id": "RES-2026-1095",
    "colorChosen": {
      "id": "col-RES-2026-1095",
      "name": "Gray GV",
      "hexCode": "#6E6F72"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-1095-0",
        "carId": "car-1785753066750",
        "carName": "Chery Tiggo 4 HEV (Gray GV)",
        "colorChosen": {
          "id": "col-RES-2026-1095",
          "name": "Gray GV",
          "hexCode": "#6E6F72"
        },
        "quantity": 1,
        "unitPriceTND": 79900,
        "totalPriceTND": 79900
      }
    ],
    "createdAt": "2026-09-17T13:31:34.582Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1095)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "26700000",
        "email": "",
        "adresse": ""
      }
    },
    "commercialId": "user-1787557525876",
    "agency": "Chery Agence Charguia 1",
    "carId": "car-1785753066750",
    "carName": "Chery Tiggo 4 HEV (Gray GV)",
    "documents": [],
    "registrationFeeTND": 0,
    "priceTND": 79900,
    "status": "Confirmée",
    "commercialName": "K2EM CHERY Charguia 1",
    "updatedAt": "2026-09-17T13:31:34.582Z",
    "paymentMethod": "Chèque Certifié"
  },
  {
    "id": "RES-2026-1094",
    "commercialId": "comm-moez",
    "commercialName": "Moez Ben Naser",
    "agency": "Siege STA",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "colorChosen": {
      "id": "col-1786454139529",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "vehicles": [
      {
        "id": "v-1789639037469",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-1786454139529",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900,
        "requiredDepositTND": 30000
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "ARBI ",
        "prenom": "JIHENE",
        "cin": "09607636",
        "ville": "Tunis",
        "telephone": "22401530",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [
      {
        "id": "doc-1789639110504-5mn7",
        "name": "IMG_3263.jpeg",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "1.31 MB",
        "uploadedAt": "2026-09-17 09:58"
      },
      {
        "id": "doc-1789639117356-urgx",
        "name": "IMG_3264.jpeg",
        "category": "cin_verso",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "1.26 MB",
        "uploadedAt": "2026-09-17 09:58"
      },
      {
        "id": "doc-1789639131481-bv7m",
        "name": "IMG_3262.jpeg",
        "category": "quittance_acompte",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "1.58 MB",
        "uploadedAt": "2026-09-17 09:58"
      }
    ],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 30000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-17T09:58:57.915Z",
    "updatedAt": "2026-09-18T09:03:43.445Z",
    "notes": "",
    "expectedDeliveryDate": "2026-10-17",
    "etaDate": "2026-09-17"
  },
  {
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery siege",
    "commercialId": "user-1787821380306",
    "id": "RES-2026-1093",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1093)",
    "status": "En attente",
    "createdAt": "2026-09-17T07:44:23.861Z",
    "priceTND": 79900,
    "commercialName": "Racha Jebeniani",
    "colorChosen": {
      "id": "col-RES-2026-1093",
      "name": "Gray GV",
      "hexCode": "#6E6F72"
    },
    "depositPaidTND": 7990,
    "vehicles": [
      {
        "id": "veh-RES-2026-1093-0",
        "carId": "car-1785753066750",
        "carName": "Chery Tiggo 4 HEV (Gray GV)",
        "colorChosen": {
          "id": "col-RES-2026-1093",
          "name": "Gray GV",
          "hexCode": "#6E6F72"
        },
        "quantity": 1,
        "unitPriceTND": 79900,
        "totalPriceTND": 79900
      }
    ],
    "updatedAt": "2026-09-17T07:44:23.861Z",
    "registrationFeeTND": 0,
    "carId": "car-1785753066750",
    "expectedDeliveryDate": "2026-10-17",
    "etaDate": "2026-09-17",
    "carName": "Chery Tiggo 4 HEV (Gray GV)",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE TECHNOCHEMICALS",
        "matriculeFiscale": "",
        "ville": "Tunis",
        "telephone": "98350755",
        "email": "",
        "adresse": ""
      }
    },
    "documents": []
  },
  {
    "registrationFeeTND": 0,
    "paymentMethod": "Chèque Certifié",
    "priceTND": 119900,
    "updatedAt": "2026-09-16T15:29:05.710Z",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "carName": "Chery Himla 4X4 BVA",
    "documents": [],
    "commercialName": "DISTRICARS Sfax",
    "client": {
      "type": "societe",
      "societe": {
        "adresse": "",
        "ville": "Sfax",
        "email": "",
        "telephone": "25438938",
        "raisonSociale": "STE BEST VISION",
        "matriculeFiscale": ""
      }
    },
    "agency": "Chery Agence Sfax",
    "id": "RES-2026-1092",
    "commercialId": "user-1787557241636",
    "depositPaidTND": 0,
    "carId": "car-1787908920743",
    "colorChosen": {
      "stock": 13,
      "hexCode": "#0A0A0A",
      "id": "col-3-1787908920743",
      "name": "Black CH",
      "reserved": 4,
      "interiorColor": "Cuir Marron"
    },
    "vehicles": [
      {
        "carId": "car-1787908920743",
        "unitPriceTND": 119900,
        "quantity": 1,
        "carName": "Chery Himla 4X4 BVA",
        "colorChosen": {
          "stock": 13,
          "reserved": 4,
          "name": "Black CH",
          "hexCode": "#0A0A0A",
          "id": "col-3-1787908920743",
          "interiorColor": "Cuir Marron"
        },
        "totalPriceTND": 119900,
        "id": "veh-RES-2026-1092-0"
      }
    ],
    "status": "Confirmée",
    "createdAt": "2026-09-16T15:29:05.710Z"
  },
  {
    "priceTND": 88900,
    "carId": "car-1785753278797",
    "depositPaidTND": 30000,
    "id": "RES-2026-1091",
    "commercialId": "user-1787557241636",
    "status": "Confirmée",
    "createdAt": "2026-09-16T14:49:01.579Z",
    "agency": "Chery Agence Sfax",
    "colorChosen": {
      "hexCode": "#727783",
      "interiorColor": "Cuir Noir",
      "stock": 15,
      "id": "col-3-1785753278797",
      "reserved": 10,
      "name": "Tech Gray GX"
    },
    "paymentMethod": "Chèque Certifié",
    "carName": "Chery Tiggo 7 PHEV (Tech Gray GX)",
    "client": {
      "type": "societe",
      "societe": {
        "matriculeFiscale": "",
        "telephone": "99845845",
        "raisonSociale": "STE FRANPRIX",
        "adresse": "",
        "ville": "Sfax",
        "email": ""
      }
    },
    "documents": [],
    "commercialName": "DISTRICARS Sfax",
    "registrationFeeTND": 0,
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "vehicles": [
      {
        "carName": "Chery Tiggo 7 PHEV (Tech Gray GX)",
        "unitPriceTND": 88900,
        "colorChosen": {
          "interiorColor": "Cuir Noir",
          "id": "col-3-1785753278797",
          "reserved": 10,
          "name": "Tech Gray GX",
          "hexCode": "#727783",
          "stock": 15
        },
        "quantity": 1,
        "id": "veh-RES-2026-1091-0",
        "carId": "car-1785753278797",
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-16T14:49:01.579Z"
  },
  {
    "commercialName": "K2EM CHERY Charguia 1",
    "carId": "car-1785753278797",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "prenom": "Anissa",
        "nom": "Aroua",
        "cin": "05602693",
        "telephone": "20427625",
        "ville": "Tunis",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [
      {
        "category": "cin_recto",
        "name": "1.jpeg",
        "id": "doc-1789566805128-rlf4",
        "dataUrl": "",
        "fileType": "image/jpeg",
        "uploadedAt": "2026-09-16 13:53",
        "sizeFormatted": "0.03 MB"
      },
      {
        "category": "cin_verso",
        "fileType": "image/jpeg",
        "uploadedAt": "2026-09-16 13:53",
        "id": "doc-1789566810170-wx9j",
        "sizeFormatted": "0.04 MB",
        "name": "WhatsApp Image 2026-09-16 at 13.39.10.jpeg",
        "dataUrl": ""
      },
      {
        "name": "WhatsApp Image 2026-09-16 at 13.39.26.jpeg",
        "fileType": "image/jpeg",
        "sizeFormatted": "0.09 MB",
        "uploadedAt": "2026-09-16 13:53",
        "dataUrl": "",
        "category": "quittance_acompte",
        "id": "doc-1789566820354-76i5"
      },
      {
        "id": "doc-1789566820374-9akx",
        "dataUrl": "",
        "fileType": "image/jpeg",
        "category": "quittance_acompte",
        "name": "WhatsApp Image 2026-09-16 at 13.39.40.jpeg",
        "uploadedAt": "2026-09-16 13:53",
        "sizeFormatted": "0.13 MB"
      }
    ],
    "registrationFeeTND": 0,
    "commercialId": "user-1787557525876",
    "vehicles": [
      {
        "id": "v-1789566740694",
        "colorChosen": {
          "name": "Black CL",
          "hexCode": "#050505",
          "id": "col-1786454139529"
        },
        "unitPriceTND": 88900,
        "totalPriceTND": 88900,
        "carId": "car-1785753278797",
        "requiredDepositTND": 30000,
        "carName": "Chery Tiggo 7 PHEV",
        "quantity": 1
      }
    ],
    "paymentMethod": "Chèque Certifié",
    "updatedAt": "2026-09-16T13:55:05.913Z",
    "id": "RES-2026-1076",
    "colorChosen": {
      "id": "col-1786454139529",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "priceTND": 88900,
    "createdAt": "2026-09-16T13:54:27.043Z",
    "expectedDeliveryDate": "2026-10-16",
    "status": "Confirmée",
    "agency": "Chery Agence Charguia 1",
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-09-16",
    "notes": "",
    "depositPaidTND": 30000
  },
  {
    "paymentMethod": "Chèque Certifié",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1077)",
    "documents": [],
    "depositPaidTND": 10299,
    "expectedDeliveryDate": "2026-10-16",
    "priceTND": 102990,
    "agency": "Chery Agence Sfax",
    "updatedAt": "2026-09-16T12:58:45.013Z",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-1077",
      "name": "Green SJ",
      "hexCode": "#727783"
    },
    "etaDate": "2026-09-16",
    "carName": "Chery Tiggo 8 PHEV (Green SJ)",
    "createdAt": "2026-09-16T12:58:45.013Z",
    "id": "RES-2026-1077",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-1077-0",
        "carId": "car-1785753367152",
        "carName": "Chery Tiggo 8 PHEV (Green SJ)",
        "colorChosen": {
          "id": "col-RES-2026-1077",
          "name": "Green SJ",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 102990,
        "totalPriceTND": 102990
      }
    ],
    "commercialId": "user-1785739349068",
    "commercialName": "Nader Chtourou",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "27531109",
        "email": "",
        "adresse": ""
      }
    },
    "carId": "car-1785753367152"
  },
  {
    "agency": "Chery Agence Sousse",
    "commercialId": "user-1787557462429",
    "id": "RES-2026-1090",
    "priceTND": 88900,
    "depositPaidTND": 0,
    "createdAt": "2026-09-16T12:52:26.537Z",
    "status": "Confirmée",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1078)",
    "carId": "car-1785753278797",
    "colorChosen": {
      "hexCode": "#727783",
      "interiorColor": "Cuir Noir",
      "reserved": 10,
      "name": "Tech Gray GX",
      "stock": 15,
      "id": "col-3-1785753278797"
    },
    "paymentMethod": "Chèque Certifié",
    "registrationFeeTND": 0,
    "updatedAt": "2026-09-16T12:52:26.537Z",
    "commercialName": "TAGOURTI CHERY Sousse",
    "vehicles": [
      {
        "carId": "car-1785753278797",
        "id": "veh-RES-2026-1090-0",
        "unitPriceTND": 88900,
        "quantity": 1,
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "stock": 15,
          "id": "col-3-1785753278797",
          "name": "Tech Gray GX",
          "reserved": 10,
          "interiorColor": "Cuir Noir",
          "hexCode": "#727783"
        },
        "totalPriceTND": 88900
      }
    ],
    "carName": "Chery Tiggo 7 PHEV",
    "client": {
      "personnePhysique": {
        "ville": "Sousse",
        "cin": "",
        "telephone": "58321560",
        "adresse": "",
        "prenom": "",
        "nom": "CHAKER MANDHOUJ",
        "email": ""
      },
      "type": "personne_physique"
    },
    "documents": []
  },
  {
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery Agence Djerba",
    "commercialId": "user-1787557295837",
    "carName": "Chery I03 4X2",
    "createdAt": "2026-09-16T11:13:55.067Z",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1076)",
    "commercialName": "LCA CHERY Djerba",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-2-1785753150277",
      "interiorColor": "Cuir Marron",
      "reserved": 1,
      "stock": 12,
      "hexCode": "#cfd3d8",
      "name": "Silver SL"
    },
    "vehicles": [
      {
        "totalPriceTND": 76900,
        "carId": "car-1785753150277",
        "unitPriceTND": 76900,
        "quantity": 1,
        "id": "veh-RES-2026-1089-0",
        "colorChosen": {
          "hexCode": "#cfd3d8",
          "interiorColor": "Cuir Marron",
          "reserved": 1,
          "id": "col-2-1785753150277",
          "name": "Silver SL",
          "stock": 12
        },
        "carName": "Chery I03 4X2"
      }
    ],
    "id": "RES-2026-1089",
    "updatedAt": "2026-09-16T11:13:55.067Z",
    "priceTND": 76900,
    "depositPaidTND": 0,
    "carId": "car-1785753150277",
    "documents": [],
    "registrationFeeTND": 0,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "email": "",
        "nom": "JERRY METGE",
        "cin": "",
        "adresse": "",
        "telephone": "27280950",
        "ville": "Tunis",
        "prenom": ""
      }
    }
  },
  {
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1077)",
    "commercialName": "DISTRICARS Sfax",
    "client": {
      "type": "societe",
      "societe": {
        "adresse": "",
        "matriculeFiscale": "",
        "ville": "Sfax",
        "email": "",
        "raisonSociale": "STE NATURALLABO",
        "telephone": "58251251"
      }
    },
    "createdAt": "2026-09-16T11:07:19.016Z",
    "colorChosen": {
      "interiorColor": "Cuir Noir",
      "reserved": 4,
      "stock": 26,
      "id": "col-1786454139529",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-1088",
    "priceTND": 88900,
    "vehicles": [
      {
        "colorChosen": {
          "reserved": 4,
          "stock": 26,
          "id": "col-1786454139529",
          "hexCode": "#050505",
          "interiorColor": "Cuir Noir",
          "name": "Black CL"
        },
        "quantity": 1,
        "totalPriceTND": 88900,
        "id": "veh-RES-2026-1088-0",
        "carName": "Chery Tiggo 7 PHEV",
        "carId": "car-1785753278797",
        "unitPriceTND": 88900
      }
    ],
    "status": "Confirmée",
    "documents": [],
    "commercialId": "user-1787557241636",
    "registrationFeeTND": 0,
    "carName": "Chery Tiggo 7 PHEV",
    "updatedAt": "2026-09-16T11:07:19.016Z",
    "depositPaidTND": 0,
    "agency": "Chery Agence Sfax",
    "carId": "car-1785753278797"
  },
  {
    "commercialId": "comm-ines",
    "updatedAt": "2026-09-16T10:56:52.117Z",
    "agency": "Chery Agence Ain Zaghouen",
    "id": "RES-2026-1062",
    "carId": "car-1785753208837",
    "vehicles": [
      {
        "id": "veh-RES-2026-1062-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4 (Green GN)",
        "colorChosen": {
          "id": "col-RES-2026-1062",
          "name": "Green GN",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "status": "Confirmée",
    "documents": [],
    "depositPaidTND": 8490,
    "commercialName": "Ines Chaari",
    "paymentMethod": "Chèque Certifié",
    "registrationFeeTND": 0,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1062)",
    "priceTND": 84900,
    "colorChosen": {
      "id": "col-RES-2026-1062",
      "name": "Green GN",
      "hexCode": "#727783"
    },
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "22132950",
        "email": "",
        "adresse": ""
      }
    },
    "createdAt": "2026-09-16T10:56:52.117Z",
    "expectedDeliveryDate": "2026-10-16",
    "etaDate": "2026-09-16",
    "carName": "Chery I03 4X4 (Green GN)"
  },
  {
    "depositPaidTND": 0,
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1076)",
    "client": {
      "type": "societe",
      "societe": {
        "adresse": "",
        "ville": "Sfax",
        "raisonSociale": "STE EMNA ET SLIMEN DECOR",
        "telephone": "20427625",
        "email": "",
        "matriculeFiscale": ""
      }
    },
    "paymentMethod": "Chèque Certifié",
    "commercialId": "user-1787557241636",
    "vehicles": [
      {
        "quantity": 1,
        "carId": "car-1787908920743",
        "id": "veh-RES-2026-1087-0",
        "colorChosen": {
          "id": "col-3-1787908920743",
          "stock": 13,
          "name": "Black CH",
          "reserved": 4,
          "interiorColor": "Cuir Marron",
          "hexCode": "#0A0A0A"
        },
        "carName": "Chery Himla 4X4 BVA",
        "unitPriceTND": 119900,
        "totalPriceTND": 119900
      }
    ],
    "createdAt": "2026-09-16T10:41:58.624Z",
    "id": "RES-2026-1087",
    "priceTND": 119900,
    "agency": "Chery Agence Sfax",
    "updatedAt": "2026-09-16T10:41:58.624Z",
    "carName": "Chery Himla 4X4 BVA",
    "carId": "car-1787908920743",
    "commercialName": "DISTRICARS Sfax",
    "status": "Confirmée",
    "registrationFeeTND": 0,
    "documents": [],
    "colorChosen": {
      "stock": 13,
      "id": "col-3-1787908920743",
      "hexCode": "#0A0A0A",
      "name": "Black CH",
      "interiorColor": "Cuir Marron",
      "reserved": 4
    }
  },
  {
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "98255019",
        "email": "",
        "adresse": ""
      }
    },
    "paymentMethod": "Chèque Certifié",
    "etaDate": "2026-09-09",
    "carName": "Chery I03 4X2",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-110)",
    "expectedDeliveryDate": "2026-10-09",
    "id": "RES-2026-110",
    "colorChosen": {
      "id": "col-RES-2026-110",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "createdAt": "2026-09-16T10:31:12.172Z",
    "commercialName": "Moez Ben Naser",
    "status": "Confirmée",
    "depositPaidTND": 7690,
    "commercialId": "comm-moez",
    "registrationFeeTND": 0,
    "carId": "car-1785753150277",
    "priceTND": 76900,
    "documents": [],
    "agency": "Siege STA",
    "vehicles": [
      {
        "id": "veh-RES-2026-110-0",
        "carId": "car-1785753150277",
        "carName": "Chery I03 4X2",
        "colorChosen": {
          "id": "col-RES-2026-110",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 76900,
        "totalPriceTND": 76900
      }
    ],
    "updatedAt": "2026-09-16T10:31:12.172Z"
  },
  {
    "status": "Confirmée",
    "createdAt": "2026-09-16T10:31:09.895Z",
    "colorChosen": {
      "id": "col-RES-2026-775",
      "name": "Gray GV",
      "hexCode": "#6E6F72"
    },
    "registrationFeeTND": 0,
    "commercialId": "comm-moez",
    "priceTND": 79900,
    "commercialName": "Moez Ben Naser",
    "carId": "car-1785753066750",
    "agency": "Siege STA",
    "expectedDeliveryDate": "2026-10-09",
    "documents": [],
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-775)",
    "depositPaidTND": 7990,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "22085204",
        "email": "",
        "adresse": ""
      }
    },
    "etaDate": "2026-09-09",
    "carName": "Chery Tiggo 4 HEV",
    "id": "RES-2026-775",
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "id": "veh-RES-2026-775-0",
        "carId": "car-1785753066750",
        "carName": "Chery Tiggo 4 HEV",
        "colorChosen": {
          "id": "col-RES-2026-775",
          "name": "Gray GV",
          "hexCode": "#6E6F72"
        },
        "quantity": 1,
        "unitPriceTND": 79900,
        "totalPriceTND": 79900
      }
    ],
    "updatedAt": "2026-09-16T10:31:09.895Z"
  },
  {
    "documents": [],
    "carId": "car-1785753066750",
    "agency": "Siege STA",
    "expectedDeliveryDate": "2026-10-10",
    "vehicles": [
      {
        "id": "veh-RES-2026-1000-0",
        "carId": "car-1785753066750",
        "carName": "Chery Tiggo 4 HEV (Gray GV)",
        "colorChosen": {
          "id": "col-RES-2026-1000",
          "name": "Gray GV",
          "hexCode": "#6E6F72"
        },
        "quantity": 1,
        "unitPriceTND": 79900,
        "totalPriceTND": 79900
      }
    ],
    "commercialName": "Moez Ben Naser",
    "updatedAt": "2026-09-16T10:31:07.558Z",
    "id": "RES-2026-1000",
    "carName": "Chery Tiggo 4 HEV (Gray GV)",
    "etaDate": "2026-09-10",
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-16T10:31:07.558Z",
    "depositPaidTND": 7990,
    "colorChosen": {
      "id": "col-RES-2026-1000",
      "name": "Gray GV",
      "hexCode": "#6E6F72"
    },
    "registrationFeeTND": 0,
    "commercialId": "comm-moez",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "58439960",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 79900,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1000)"
  },
  {
    "commercialId": "comm-moez",
    "createdAt": "2026-09-16T10:30:54.273Z",
    "status": "Confirmée",
    "priceTND": 102900,
    "colorChosen": {
      "id": "col-RES-2026-591",
      "name": "Black CH",
      "hexCode": "#727783"
    },
    "etaDate": "2026-09-09",
    "carName": "Chery Himla 4X4 BVM",
    "carId": "car-1785514106502",
    "paymentMethod": "Chèque Certifié",
    "commercialName": "Moez Ben Naser",
    "agency": "Siege STA",
    "depositPaidTND": 10290,
    "registrationFeeTND": 0,
    "documents": [],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "98113651",
        "email": "",
        "adresse": ""
      }
    },
    "id": "RES-2026-591",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-591)",
    "expectedDeliveryDate": "2026-10-09",
    "updatedAt": "2026-09-16T10:30:54.273Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-591-0",
        "carId": "car-1785514106502",
        "carName": "Chery Himla 4X4 BVM",
        "colorChosen": {
          "id": "col-RES-2026-591",
          "name": "Black CH",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 102900,
        "totalPriceTND": 102900
      }
    ]
  },
  {
    "carId": "car-1785753278797",
    "id": "RES-2026-1086",
    "colorChosen": {
      "reserved": 4,
      "name": "Black CL",
      "id": "col-1786454139529",
      "stock": 26,
      "hexCode": "#050505",
      "interiorColor": "Cuir Noir"
    },
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "vehicles": [
      {
        "carName": "Chery Tiggo 7 PHEV",
        "carId": "car-1785753278797",
        "totalPriceTND": 88900,
        "colorChosen": {
          "hexCode": "#050505",
          "reserved": 4,
          "id": "col-1786454139529",
          "interiorColor": "Cuir Noir",
          "name": "Black CL",
          "stock": 26
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "id": "veh-RES-2026-1086-0"
      }
    ],
    "agency": "Siege STA",
    "depositPaidTND": 0,
    "createdAt": "2026-09-16T10:30:02.000Z",
    "commercialName": "Moez Ben Naser",
    "commercialId": "comm-moez",
    "priceTND": 88900,
    "updatedAt": "2026-09-16T10:30:02.000Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "email": "",
        "telephone": "29102203",
        "nom": "SAMA CONSULTING",
        "adresse": "",
        "cin": "",
        "ville": "Tunis",
        "prenom": ""
      }
    },
    "carName": "Chery Tiggo 7 PHEV",
    "paymentMethod": "Chèque Certifié",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "documents": []
  },
  {
    "depositPaidTND": 8890,
    "status": "Confirmée",
    "vehicles": [
      {
        "id": "veh-RES-2026-1074-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Tech Gray GX)",
        "colorChosen": {
          "id": "col-RES-2026-1074",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "expectedDeliveryDate": "2026-10-16",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1074)",
    "documents": [],
    "updatedAt": "2026-09-16T09:32:09.049Z",
    "id": "RES-2026-1074",
    "agency": "Chery Agence Sfax",
    "registrationFeeTND": 0,
    "createdAt": "2026-09-16T09:32:09.049Z",
    "commercialId": "user-1787557241636",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "la réservation confirmée #RES-2026-1074 au nom de STE AYA SOFIA",
        "matriculeFiscale": "",
        "ville": "Sfax",
        "telephone": "26000091",
        "email": "",
        "adresse": ""
      }
    },
    "carName": "Chery Tiggo 7 PHEV (Tech Gray GX)",
    "etaDate": "2026-09-16",
    "colorChosen": {
      "id": "col-RES-2026-1074",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "carId": "car-1785753278797",
    "paymentMethod": "Chèque Certifié",
    "priceTND": 88900,
    "commercialName": "DISTRICARS Sfax"
  },
  {
    "updatedAt": "2026-09-16T08:27:08.931Z",
    "agency": "Siege STA",
    "id": "RES-2026-1072",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "etaDate": "2026-09-16",
    "registrationFeeTND": 0,
    "commercialName": "Moez Ben Naser",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1072)",
    "documents": [],
    "status": "Confirmée",
    "vehicles": [
      {
        "id": "veh-RES-2026-1072-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Black CL)",
        "colorChosen": {
          "id": "col-RES-2026-1072",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "paymentMethod": "Chèque Certifié",
    "priceTND": 88900,
    "commercialId": "comm-moez",
    "carId": "car-1785753278797",
    "expectedDeliveryDate": "2026-10-16",
    "createdAt": "2026-09-16T08:27:08.931Z",
    "depositPaidTND": 8890,
    "colorChosen": {
      "id": "col-RES-2026-1072",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "95990175",
        "email": "",
        "adresse": ""
      }
    }
  },
  {
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "98301011",
        "email": "",
        "adresse": ""
      }
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-1058-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Black CL)",
        "colorChosen": {
          "id": "col-RES-2026-1058",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "documents": [],
    "commercialName": "Moez Ben Naser",
    "carId": "car-1785753278797",
    "updatedAt": "2026-09-16T08:10:55.388Z",
    "status": "Confirmée",
    "commercialId": "comm-moez",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "etaDate": "2026-09-15",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1058)",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-16T08:10:55.388Z",
    "id": "RES-2026-1058",
    "depositPaidTND": 8890,
    "priceTND": 88900,
    "colorChosen": {
      "id": "col-RES-2026-1058",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "expectedDeliveryDate": "2026-10-15",
    "registrationFeeTND": 0,
    "agency": "Siege STA"
  },
  {
    "id": "RES-2026-1063",
    "commercialName": "Moez Ben Naser",
    "colorChosen": {
      "id": "col-RES-2026-1063",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1063)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "20267950",
        "email": "",
        "adresse": ""
      }
    },
    "createdAt": "2026-09-16T08:10:51.371Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-1063-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Black CL)",
        "colorChosen": {
          "id": "col-RES-2026-1063",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "expectedDeliveryDate": "2026-10-15",
    "updatedAt": "2026-09-16T08:10:51.371Z",
    "agency": "Siege STA",
    "priceTND": 88900,
    "carId": "car-1785753278797",
    "commercialId": "comm-moez",
    "paymentMethod": "Chèque Certifié",
    "documents": [],
    "status": "Confirmée",
    "registrationFeeTND": 0,
    "depositPaidTND": 8890,
    "etaDate": "2026-09-15",
    "carName": "Chery Tiggo 7 PHEV (Black CL)"
  },
  {
    "commercialName": "TAGOURTI CHERY Sousse",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "réservation confirmée #RES-2026-1065 au nom de RABBOUDI MOHAMED",
        "prenom": "la",
        "cin": "",
        "ville": "Sousse",
        "telephone": "29647267",
        "email": "",
        "adresse": ""
      }
    },
    "registrationFeeTND": 0,
    "priceTND": 102900,
    "createdAt": "2026-09-16T07:41:58.404Z",
    "commercialId": "user-1787557462429",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1065)",
    "expectedDeliveryDate": "2026-10-16",
    "id": "RES-2026-1065",
    "colorChosen": {
      "id": "col-RES-2026-1065",
      "name": "Silver Gray GR",
      "hexCode": "#BFBFBF"
    },
    "documents": [],
    "status": "Confirmée",
    "carName": "Chery Himla 4X4 BVM (Silver Gray GR)",
    "etaDate": "2026-09-16",
    "carId": "car-1785514106502",
    "updatedAt": "2026-09-16T07:41:58.404Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-1065-0",
        "carId": "car-1785514106502",
        "carName": "Chery Himla 4X4 BVM (Silver Gray GR)",
        "colorChosen": {
          "id": "col-RES-2026-1065",
          "name": "Silver Gray GR",
          "hexCode": "#BFBFBF"
        },
        "quantity": 1,
        "unitPriceTND": 102900,
        "totalPriceTND": 102900
      }
    ],
    "depositPaidTND": 10290,
    "agency": "Chery Agence Sousse",
    "paymentMethod": "Chèque Certifié"
  },
  {
    "carId": "car-1785513071800",
    "id": "RES-2026-1085",
    "carName": "Chery Tiggo 9 PHEV",
    "updatedAt": "2026-09-16T06:05:41.632Z",
    "client": {
      "personnePhysique": {
        "email": "",
        "nom": "IBRAHIM NAFZAOUI",
        "adresse": "",
        "prenom": "",
        "cin": "",
        "telephone": "29020218",
        "ville": "Tunis"
      },
      "type": "personne_physique"
    },
    "commercialName": "Marwa Frikha",
    "priceTND": 129900,
    "documents": [],
    "colorChosen": {
      "hexCode": "#030303",
      "stock": 14,
      "name": "Black CM",
      "interiorColor": "Cuir Beige & Bleu",
      "reserved": 3,
      "id": "col-1786981421374"
    },
    "vehicles": [
      {
        "colorChosen": {
          "interiorColor": "Cuir Beige & Bleu",
          "hexCode": "#030303",
          "name": "Black CM",
          "stock": 14,
          "id": "col-1786981421374",
          "reserved": 3
        },
        "id": "veh-RES-2026-1085-0",
        "totalPriceTND": 129900,
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "unitPriceTND": 129900,
        "quantity": 1
      }
    ],
    "status": "Confirmée",
    "registrationFeeTND": 0,
    "agency": "Siege STA",
    "createdAt": "2026-09-16T06:05:41.632Z",
    "depositPaidTND": 0,
    "commercialId": "comm-marwa",
    "paymentMethod": "Chèque Certifié",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)"
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-224)",
    "paymentMethod": "Chèque Certifié",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "55558370",
        "email": "",
        "adresse": ""
      }
    },
    "depositPaidTND": 12990,
    "documents": [],
    "status": "Confirmée",
    "commercialName": "Marwa Frikha",
    "expectedDeliveryDate": "2026-10-09",
    "etaDate": "2026-09-09",
    "carName": "Chery Tiggo 9 PHEV",
    "commercialId": "comm-marwa",
    "createdAt": "2026-09-16T05:53:25.029Z",
    "id": "RES-2026-224",
    "priceTND": 129900,
    "registrationFeeTND": 0,
    "agency": "Siege STA",
    "colorChosen": {
      "id": "col-RES-2026-224",
      "name": "White BX",
      "hexCode": "#F8FAFC"
    },
    "carId": "car-1785513071800",
    "vehicles": [
      {
        "id": "veh-RES-2026-224-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-224",
          "name": "White BX",
          "hexCode": "#F8FAFC"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-16T05:53:25.029Z"
  },
  {
    "agency": "Siege STA",
    "documents": [],
    "carId": "car-1785753278797",
    "commercialName": "Marwa Frikha",
    "id": "RES-2026-372",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-372",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "paymentMethod": "Chèque Certifié",
    "priceTND": 88900,
    "createdAt": "2026-09-16T05:53:07.280Z",
    "etaDate": "2026-09-09",
    "carName": "Chery Tiggo 7 PHEV",
    "commercialId": "comm-marwa",
    "registrationFeeTND": 0,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "98224288",
        "email": "",
        "adresse": ""
      }
    },
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-372)",
    "depositPaidTND": 8890,
    "expectedDeliveryDate": "2026-10-09",
    "vehicles": [
      {
        "id": "veh-RES-2026-372-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-372",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-16T05:53:07.280Z"
  },
  {
    "id": "RES-2026-1071",
    "priceTND": 88900,
    "depositPaidTND": 0,
    "carId": "car-1785753278797",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "adresse": "",
        "prenom": "",
        "ville": "Tunis",
        "cin": "",
        "nom": "SALIM SLIMEN",
        "email": "",
        "telephone": "22227154"
      }
    },
    "carName": "Chery Tiggo 7 PHEV",
    "createdAt": "2026-09-15T16:10:14.449Z",
    "colorChosen": {
      "stock": 18,
      "name": "Exclusive Blue WE",
      "interiorColor": "Cuir Noir",
      "hexCode": "#217CB5",
      "reserved": 2,
      "id": "col-1786454192522"
    },
    "updatedAt": "2026-09-15T16:10:14.449Z",
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "commercialId": "comm-moez",
    "commercialName": "Moez Ben Naser",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "vehicles": [
      {
        "quantity": 1,
        "carName": "Chery Tiggo 7 PHEV",
        "totalPriceTND": 88900,
        "carId": "car-1785753278797",
        "colorChosen": {
          "reserved": 2,
          "interiorColor": "Cuir Noir",
          "hexCode": "#217CB5",
          "name": "Exclusive Blue WE",
          "stock": 18,
          "id": "col-1786454192522"
        },
        "unitPriceTND": 88900,
        "id": "veh-RES-2026-1071-0"
      }
    ],
    "agency": "Siege STA",
    "documents": [],
    "paymentMethod": "Chèque Certifié"
  },
  {
    "id": "RES-2026-1064",
    "vehicles": [
      {
        "id": "veh-RES-2026-1064-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV (Black CM)",
        "colorChosen": {
          "id": "col-RES-2026-1064",
          "name": "Black CM",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "98626655",
        "email": "",
        "adresse": ""
      }
    },
    "createdAt": "2026-09-15T15:28:28.599Z",
    "depositPaidTND": 12990,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1064)",
    "expectedDeliveryDate": "2026-10-15",
    "registrationFeeTND": 0,
    "agency": "Chery Agence Sfax",
    "commercialName": "DISTRICARS Sfax",
    "carId": "car-1785513071800",
    "updatedAt": "2026-09-15T15:28:28.599Z",
    "priceTND": 129900,
    "commercialId": "user-1787557241636",
    "paymentMethod": "Chèque Certifié",
    "etaDate": "2026-09-15",
    "carName": "Chery Tiggo 9 PHEV (Black CM)",
    "documents": [],
    "colorChosen": {
      "id": "col-RES-2026-1064",
      "name": "Black CM",
      "hexCode": "#727783"
    },
    "status": "Confirmée"
  },
  {
    "updatedAt": "2026-09-15T13:24:18.909Z",
    "registrationFeeTND": 0,
    "carId": "car-1785753278797",
    "depositPaidTND": 0,
    "priceTND": 88900,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "cin": "",
        "prenom": "",
        "telephone": "29655369",
        "email": "",
        "ville": "Tunis",
        "adresse": "",
        "nom": "HOUDA OMRI"
      }
    },
    "colorChosen": {
      "stock": 13,
      "name": "Tech Gray GX",
      "hexCode": "#727783",
      "id": "col-3-1785753278797",
      "interiorColor": "Cuir Noir",
      "reserved": 12
    },
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "commercialName": "Moez Ben Naser",
    "agency": "Siege STA",
    "vehicles": [
      {
        "totalPriceTND": 88900,
        "colorChosen": {
          "name": "Tech Gray GX",
          "hexCode": "#727783",
          "stock": 13,
          "reserved": 12,
          "id": "col-3-1785753278797",
          "interiorColor": "Cuir Noir"
        },
        "carName": "Chery Tiggo 7 PHEV",
        "carId": "car-1785753278797",
        "unitPriceTND": 88900,
        "quantity": 1,
        "id": "veh-RES-2026-1070-0"
      }
    ],
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "commercialId": "comm-moez",
    "id": "RES-2026-1070",
    "carName": "Chery Tiggo 7 PHEV",
    "createdAt": "2026-09-15T13:24:18.909Z",
    "status": "Confirmée"
  },
  {
    "priceTND": 88900,
    "updatedAt": "2026-09-15T12:20:08.085Z",
    "registrationFeeTND": 0,
    "commercialName": "Racha Jebeniani",
    "etaDate": "2026-09-15",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "expectedDeliveryDate": "2026-10-15",
    "carId": "car-1785753278797",
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-1017",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "commercialId": "user-1787821380306",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "HABIB IMAM",
        "prenom": "MOHAMED",
        "cin": "",
        "ville": "Tunis",
        "telephone": "98506488",
        "email": "",
        "adresse": ""
      }
    },
    "agency": "Chery siege",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1017)",
    "id": "RES-2026-1017",
    "createdAt": "2026-09-15T12:20:08.085Z",
    "status": "En attente",
    "depositPaidTND": 8890,
    "vehicles": [
      {
        "id": "veh-RES-2026-1017-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Black CL)",
        "colorChosen": {
          "id": "col-RES-2026-1017",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ]
  },
  {
    "id": "RES-2026-1084",
    "carName": "Chery I03 4X4",
    "documents": [],
    "colorChosen": {
      "interiorColor": "Cuir Marron",
      "reserved": 0,
      "hexCode": "#626a68",
      "stock": 30,
      "id": "col-1786454499484",
      "name": "Gray GY"
    },
    "carId": "car-1785753208837",
    "client": {
      "personnePhysique": {
        "ville": "Tunis",
        "email": "",
        "nom": "SOUMAYA OUHAD",
        "prenom": "",
        "cin": "",
        "adresse": "",
        "telephone": "98609663"
      },
      "type": "personne_physique"
    },
    "paymentMethod": "Chèque Certifié",
    "updatedAt": "2026-09-15T12:16:37.269Z",
    "commercialName": "Marwa Frikha",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "carId": "car-1785753208837",
        "totalPriceTND": 84900,
        "quantity": 1,
        "id": "veh-RES-2026-1084-0",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "reserved": 0,
          "stock": 30,
          "hexCode": "#626a68",
          "name": "Gray GY",
          "interiorColor": "Cuir Marron",
          "id": "col-1786454499484"
        },
        "unitPriceTND": 84900
      }
    ],
    "priceTND": 84900,
    "createdAt": "2026-09-15T12:16:37.269Z",
    "status": "Confirmée",
    "depositPaidTND": 20000,
    "agency": "Siege STA",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1062)",
    "commercialId": "comm-marwa"
  },
  {
    "vehicles": [
      {
        "totalPriceTND": 88900,
        "unitPriceTND": 88900,
        "quantity": 1,
        "carId": "car-1785753278797",
        "colorChosen": {
          "id": "col-3-1785753278797",
          "hexCode": "#727783",
          "name": "Tech Gray GX",
          "reserved": 12,
          "stock": 13,
          "interiorColor": "Cuir Noir"
        },
        "carName": "Chery Tiggo 7 PHEV",
        "id": "veh-RES-2026-1069-0"
      }
    ],
    "updatedAt": "2026-09-15T11:51:28.964Z",
    "status": "Confirmée",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "documents": [],
    "carName": "Chery Tiggo 7 PHEV",
    "agency": "Chery siege",
    "depositPaidTND": 0,
    "colorChosen": {
      "hexCode": "#727783",
      "interiorColor": "Cuir Noir",
      "reserved": 12,
      "id": "col-3-1785753278797",
      "name": "Tech Gray GX",
      "stock": 13
    },
    "client": {
      "personnePhysique": {
        "email": "",
        "nom": "AYDA BEN GHORBEL",
        "prenom": "",
        "cin": "",
        "telephone": "55230043",
        "adresse": "",
        "ville": "Tunis"
      },
      "type": "personne_physique"
    },
    "commercialName": "Racha Jebeniani",
    "commercialId": "user-1787821380306",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-15T11:51:28.964Z",
    "carId": "car-1785753278797",
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "id": "RES-2026-1069"
  },
  {
    "updatedAt": "2026-09-15T10:56:10.972Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "email": "sami.guermessi@lcamotors.tn",
        "ville": "Médenine",
        "telephone": "98527524",
        "cin": "03501616",
        "nom": "GUERMASSI",
        "prenom": "MONCEF",
        "adresse": "MIDOUN DJERBA"
      }
    },
    "id": "RES-2026-1061",
    "commercialId": "user-1787557295837",
    "vehicles": [
      {
        "colorChosen": {
          "id": "col-1786454514433",
          "hexCode": "#255645",
          "name": "Green GN"
        },
        "totalPriceTND": 84900,
        "carName": "Chery I03 4X4",
        "carId": "car-1785753208837",
        "unitPriceTND": 84900,
        "quantity": 1,
        "requiredDepositTND": 20000,
        "id": "v-1789469542162"
      }
    ],
    "documents": [
      {
        "fileType": "image/jpeg",
        "category": "cin_recto",
        "uploadedAt": "2026-09-15 10:54",
        "dataUrl": "",
        "name": "d2bb61a5-89ef-4706-aecb-03b4cb5e0696.jpg",
        "id": "doc-1789469662473-jwdh",
        "sizeFormatted": "0.12 MB"
      },
      {
        "sizeFormatted": "0.14 MB",
        "category": "cin_recto",
        "fileType": "image/jpeg",
        "id": "doc-1789469662499-6x73",
        "dataUrl": "",
        "uploadedAt": "2026-09-15 10:54",
        "name": "cf6caeae-91eb-4737-9888-dbfdd0b7fe21.jpg"
      },
      {
        "uploadedAt": "2026-09-15 10:54",
        "category": "cin_recto",
        "sizeFormatted": "0.19 MB",
        "fileType": "image/jpeg",
        "id": "doc-1789469662527-ixh5",
        "dataUrl": "",
        "name": "404d0cb4-5557-47b5-9608-3a0b3193c493.jpg"
      },
      {
        "sizeFormatted": "0.30 MB",
        "uploadedAt": "2026-09-15 10:54",
        "dataUrl": "",
        "category": "cin_recto",
        "id": "doc-1789469662562-9c7j",
        "name": "34cc91b4-f838-4122-8b22-a84afde0e24b.jpg",
        "fileType": "image/jpeg"
      },
      {
        "sizeFormatted": "0.21 MB",
        "id": "doc-1789469662590-5saz",
        "dataUrl": "",
        "name": "8076bb1e-4903-4fd0-849f-0b44d734dd06.jpg",
        "uploadedAt": "2026-09-15 10:54",
        "category": "cin_recto",
        "fileType": "image/jpeg"
      }
    ],
    "carName": "Chery I03 4X4",
    "etaDate": "2026-09-15",
    "paymentMethod": "Virement Bancaire",
    "colorChosen": {
      "hexCode": "#255645",
      "name": "Green GN",
      "id": "col-1786454514433"
    },
    "carId": "car-1785753208837",
    "depositPaidTND": 20000,
    "status": "Confirmée",
    "notes": "",
    "commercialName": "LCA CHERY Djerba",
    "priceTND": 84900,
    "registrationFeeTND": 0,
    "createdAt": "2026-09-15T10:55:09.348Z",
    "expectedDeliveryDate": "2026-10-15",
    "agency": "Chery Agence Djerba"
  },
  {
    "agency": "Siege STA",
    "priceTND": 88900,
    "commercialId": "comm-marwa",
    "commercialName": "Marwa Frikha",
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-15T10:39:48.982Z",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "colorChosen": {
      "id": "col-2-1785753278797",
      "reserved": 4,
      "stock": 31,
      "hexCode": "#939AA5",
      "name": "Phantom Gray GV",
      "interiorColor": "Cuir Noir"
    },
    "carId": "car-1785753278797",
    "registrationFeeTND": 0,
    "id": "RES-2026-1068",
    "updatedAt": "2026-09-15T10:39:48.982Z",
    "depositPaidTND": 0,
    "vehicles": [
      {
        "carName": "Chery Tiggo 7 PHEV",
        "unitPriceTND": 88900,
        "carId": "car-1785753278797",
        "quantity": 1,
        "totalPriceTND": 88900,
        "colorChosen": {
          "name": "Phantom Gray GV",
          "interiorColor": "Cuir Noir",
          "stock": 31,
          "hexCode": "#939AA5",
          "reserved": 4,
          "id": "col-2-1785753278797"
        },
        "id": "veh-RES-2026-1068-0"
      }
    ],
    "documents": [],
    "carName": "Chery Tiggo 7 PHEV",
    "client": {
      "personnePhysique": {
        "cin": "",
        "prenom": "",
        "telephone": "52341934",
        "ville": "Tunis",
        "adresse": "",
        "email": "",
        "nom": "FAIZA BOURICHA"
      },
      "type": "personne_physique"
    }
  },
  {
    "paymentMethod": "Chèque Certifié",
    "carId": "car-1785753278797",
    "vehicles": [
      {
        "carName": "Chery Tiggo 7 PHEV",
        "id": "veh-RES-2026-1067-0",
        "totalPriceTND": 88900,
        "carId": "car-1785753278797",
        "unitPriceTND": 88900,
        "quantity": 1,
        "colorChosen": {
          "stock": 20,
          "name": "White BW",
          "hexCode": "#FFFFFF",
          "interiorColor": "Cuir Noir",
          "id": "col-1-1785753278797",
          "reserved": 5
        }
      }
    ],
    "createdAt": "2026-09-15T10:30:42.258Z",
    "status": "Confirmée",
    "agency": "Siege STA",
    "carName": "Chery Tiggo 7 PHEV",
    "commercialName": "Moez Ben Naser",
    "colorChosen": {
      "interiorColor": "Cuir Noir",
      "hexCode": "#FFFFFF",
      "id": "col-1-1785753278797",
      "reserved": 5,
      "name": "White BW",
      "stock": 20
    },
    "client": {
      "personnePhysique": {
        "cin": "",
        "telephone": "92465569",
        "email": "",
        "adresse": "",
        "ville": "Tunis",
        "nom": "SAFA KHEMIRI",
        "prenom": ""
      },
      "type": "personne_physique"
    },
    "registrationFeeTND": 0,
    "depositPaidTND": 0,
    "documents": [],
    "id": "RES-2026-1067",
    "priceTND": 88900,
    "commercialId": "comm-moez",
    "updatedAt": "2026-09-15T10:30:42.258Z",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)"
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-316)",
    "expectedDeliveryDate": "2026-10-08",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sousse",
        "telephone": "48 216 215",
        "email": "",
        "adresse": ""
      }
    },
    "commercialName": "TAGOURTI CHERY Sousse",
    "colorChosen": {
      "id": "col-RES-2026-316",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-09-08",
    "documents": [],
    "registrationFeeTND": 0,
    "agency": "Chery Agence Sousse",
    "depositPaidTND": 8890,
    "id": "RES-2026-316",
    "commercialId": "user-1787557462429",
    "carId": "car-1785753278797",
    "status": "Confirmée",
    "createdAt": "2026-09-15T10:09:30.556Z",
    "paymentMethod": "Chèque Certifié",
    "priceTND": 88900,
    "vehicles": [
      {
        "id": "veh-RES-2026-316-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-316",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-15T10:09:30.556Z"
  },
  {
    "registrationFeeTND": 0,
    "expectedDeliveryDate": "2026-12-15",
    "commercialName": "TAGOURTI CHERY Sousse",
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-11-15",
    "interiorColorChosen": {
      "name": "Noir Carbone",
      "id": "int-tiggo7-1",
      "hexCode": "#0F172A"
    },
    "id": "RES-2026-649",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sousse",
        "telephone": "97448272",
        "email": "",
        "adresse": ""
      }
    },
    "carId": "car-1785753278797",
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery Agence Sousse",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-649)",
    "createdAt": "2026-09-15T10:09:25.621Z",
    "colorChosen": {
      "id": "col-RES-2026-649",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "status": "Confirmée",
    "priceTND": 88900,
    "commercialId": "user-1787557462429",
    "depositPaidTND": 8890,
    "vehicles": [
      {
        "id": "veh-RES-2026-649-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-649",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-15T10:09:25.621Z"
  },
  {
    "commercialName": "TAGOURTI CHERY Sousse",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sousse",
        "telephone": "55440909",
        "email": "",
        "adresse": ""
      }
    },
    "paymentMethod": "Chèque Certifié",
    "etaDate": "2026-09-04",
    "carName": "Chery Tiggo 7 PHEV",
    "documents": [],
    "carId": "car-1785753278797",
    "interiorColorChosen": {
      "name": "Noir Carbone",
      "hexCode": "#0F172A",
      "id": "int-tiggo7-1"
    },
    "commercialId": "user-1787557462429",
    "status": "Confirmée",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-338)",
    "id": "RES-2026-338",
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "expectedDeliveryDate": "2026-10-04",
    "agency": "Chery Agence Sousse",
    "createdAt": "2026-09-15T10:09:00.637Z",
    "colorChosen": {
      "id": "col-RES-2026-338",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "depositPaidTND": 8890,
    "vehicles": [
      {
        "id": "veh-RES-2026-338-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-338",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-15T10:09:00.637Z"
  },
  {
    "interiorColorChosen": {
      "name": "Cuir Marron",
      "id": "int-i03-4x4-1",
      "hexCode": "#78350F"
    },
    "carId": "car-1785753208837",
    "depositPaidTND": 8490,
    "documents": [],
    "colorChosen": {
      "id": "col-RES-2026-447",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sousse",
        "telephone": "99072418",
        "email": "",
        "adresse": ""
      }
    },
    "carName": "Chery I03 4X4",
    "etaDate": "2026-09-04",
    "agency": "Chery Agence Sousse",
    "registrationFeeTND": 0,
    "createdAt": "2026-09-15T10:08:46.270Z",
    "paymentMethod": "Chèque Certifié",
    "commercialId": "user-1787557462429",
    "id": "RES-2026-447",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-447)",
    "expectedDeliveryDate": "2026-10-04",
    "commercialName": "TAGOURTI CHERY Sousse",
    "priceTND": 84900,
    "status": "Confirmée",
    "vehicles": [
      {
        "id": "veh-RES-2026-447-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-447",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-15T10:08:46.270Z"
  },
  {
    "agency": "Chery Agence Charguia 1",
    "documents": [
      {
        "id": "doc-1789463325387-vwhh",
        "category": "cin_recto",
        "uploadedAt": "2026-09-15 09:08",
        "name": "1.jpeg",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "sizeFormatted": "0.08 MB"
      },
      {
        "dataUrl": "",
        "name": "2.jpeg",
        "fileType": "image/jpeg",
        "uploadedAt": "2026-09-15 09:08",
        "category": "cin_verso",
        "sizeFormatted": "0.09 MB",
        "id": "doc-1789463331317-xrbv"
      },
      {
        "id": "doc-1789463343418-x5gb",
        "dataUrl": "",
        "name": "WhatsApp Image 2026-09-15 at 09.54.44.jpeg",
        "category": "quittance_acompte",
        "sizeFormatted": "0.04 MB",
        "uploadedAt": "2026-09-15 09:09",
        "fileType": "image/jpeg"
      }
    ],
    "carId": "car-1785753278797",
    "commercialName": "K2EM CHERY Charguia 1",
    "updatedAt": "2026-09-15T09:09:33.390Z",
    "vehicles": [
      {
        "quantity": 1,
        "colorChosen": {
          "name": "Black CL",
          "id": "col-1786454139529",
          "hexCode": "#050505"
        },
        "id": "v-1789463212303",
        "carName": "Chery Tiggo 7 PHEV",
        "totalPriceTND": 88900,
        "carId": "car-1785753278797",
        "unitPriceTND": 88900,
        "requiredDepositTND": 30000
      }
    ],
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-1786454139529",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "commercialId": "user-1787557525876",
    "paymentMethod": "Chèque Certifié",
    "priceTND": 88900,
    "createdAt": "2026-09-15T09:09:26.330Z",
    "etaDate": "2026-09-15",
    "carName": "Chery Tiggo 7 PHEV",
    "registrationFeeTND": 0,
    "id": "RES-2026-1060",
    "expectedDeliveryDate": "2026-10-15",
    "depositPaidTND": 30000,
    "client": {
      "personnePhysique": {
        "nom": "Shili",
        "cin": "02271577",
        "ville": "Tunis",
        "telephone": "25437273",
        "prenom": "Nizar",
        "adresse": "",
        "email": ""
      },
      "type": "personne_physique"
    },
    "notes": ""
  },
  {
    "priceTND": 102990,
    "status": "Confirmée",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1059)",
    "createdAt": "2026-09-15T08:55:40.797Z",
    "colorChosen": {
      "id": "col-RES-2026-1059",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "id": "RES-2026-1059",
    "agency": "Chery Agence Nabeul",
    "depositPaidTND": 10299,
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "la réservation confirmée #RES-2026-1059 au nom de Ste Mariem de Transport de travaux et services",
        "matriculeFiscale": "",
        "ville": "Tunis",
        "telephone": "24533901",
        "email": "",
        "adresse": ""
      }
    },
    "updatedAt": "2026-09-15T08:55:40.797Z",
    "carName": "Chery Tiggo 8 PHEV (Black CL)",
    "etaDate": "2026-09-15",
    "commercialName": "S2A CHERY Gabes",
    "expectedDeliveryDate": "2026-10-15",
    "paymentMethod": "Chèque Certifié",
    "documents": [],
    "carId": "car-1785753367152",
    "vehicles": [
      {
        "id": "veh-RES-2026-1059-0",
        "carId": "car-1785753367152",
        "carName": "Chery Tiggo 8 PHEV (Black CL)",
        "colorChosen": {
          "id": "col-RES-2026-1059",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 102990,
        "totalPriceTND": 102990
      }
    ],
    "registrationFeeTND": 0,
    "commercialId": "user-1787557384756"
  },
  {
    "id": "RES-2026-1035",
    "commercialId": "user-1787557384756",
    "commercialName": "S2A CHERY Gabes",
    "agency": "Chery Agence Nabeul",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV",
    "colorChosen": {
      "id": "col-3-1785753278797",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-1035-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-3-1785753278797",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "depositPaidTND": 30000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-15T07:59:43.030Z",
    "updatedAt": "2026-09-15T07:59:43.030Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1035)"
  },
  {
    "expectedDeliveryDate": "2026-10-15",
    "id": "RES-2026-1018",
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "carId": "car-1785753208837",
    "priceTND": 84900,
    "agency": "Siege STA",
    "createdAt": "2026-09-15T06:10:58.964Z",
    "colorChosen": {
      "id": "col-RES-2026-1018",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "depositPaidTND": 8490,
    "carName": "Chery I03 4X4 (Black BL)",
    "etaDate": "2026-09-15",
    "commercialName": "Marwa Frikha",
    "updatedAt": "2026-09-15T06:10:58.964Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-1018-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4 (Black BL)",
        "colorChosen": {
          "id": "col-RES-2026-1018",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "20108000",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1018)",
    "commercialId": "comm-marwa"
  },
  {
    "vehicles": [
      {
        "carId": "car-1785753150277",
        "carName": "Chery I03 4X2",
        "unitPriceTND": 76900,
        "quantity": 1,
        "totalPriceTND": 76900,
        "id": "veh-RES-2026-1066-0",
        "colorChosen": {
          "hexCode": "#171717",
          "id": "col-1-1785753150277",
          "reserved": 5,
          "stock": 15,
          "interiorColor": "Cuir Marron",
          "name": "Black BL"
        }
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "email": "",
        "ville": "Tunis",
        "prenom": "",
        "adresse": "",
        "cin": "",
        "nom": "NAJLA CHRIF HAMDI",
        "telephone": "52030030"
      }
    },
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "interiorColor": "Cuir Marron",
      "reserved": 5,
      "id": "col-1-1785753150277",
      "stock": 15,
      "hexCode": "#171717",
      "name": "Black BL"
    },
    "commercialId": "comm-marwa",
    "carId": "car-1785753150277",
    "carName": "Chery I03 4X2",
    "createdAt": "2026-09-15T06:01:26.386Z",
    "commercialName": "Marwa Frikha",
    "registrationFeeTND": 0,
    "id": "RES-2026-1066",
    "status": "Confirmée",
    "depositPaidTND": 20000,
    "updatedAt": "2026-09-15T06:01:26.386Z",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1017)",
    "agency": "Siege STA",
    "priceTND": 76900,
    "documents": []
  },
  {
    "agency": "Siege STA",
    "carId": "car-1785753208837",
    "carName": "Chery I03 4X4",
    "colorChosen": {
      "reserved": 1,
      "stock": 29,
      "hexCode": "#626a68",
      "name": "Gray GY",
      "interiorColor": "Cuir Marron",
      "id": "col-1786454499484"
    },
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-15T05:55:06.266Z",
    "id": "RES-2026-1073",
    "priceTND": 84900,
    "depositPaidTND": 0,
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "commercialName": "Marwa Frikha",
    "updatedAt": "2026-09-15T05:55:06.266Z",
    "commercialId": "comm-marwa",
    "vehicles": [
      {
        "id": "veh-RES-2026-1073-0",
        "colorChosen": {
          "interiorColor": "Cuir Marron",
          "reserved": 1,
          "hexCode": "#626a68",
          "name": "Gray GY",
          "id": "col-1786454499484",
          "stock": 29
        },
        "unitPriceTND": 84900,
        "totalPriceTND": 84900,
        "carName": "Chery I03 4X4",
        "quantity": 1,
        "carId": "car-1785753208837"
      }
    ],
    "documents": [],
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "client": {
      "type": "societe",
      "societe": {
        "ville": "Tunis",
        "telephone": "98411269",
        "raisonSociale": "STE SELOTEC",
        "matriculeFiscale": "",
        "adresse": "",
        "email": ""
      }
    }
  },
  {
    "agency": "Siege STA",
    "documents": [
      {
        "uploadedAt": "2026-09-15 05:49",
        "id": "doc-1789451374984-lkl6",
        "dataUrl": "",
        "name": "17894513586481412040625807044061.jpg",
        "category": "registre_commerce",
        "sizeFormatted": "2.88 MB",
        "fileType": "image/jpeg"
      },
      {
        "sizeFormatted": "0.37 MB",
        "name": "Screenshot_20260915_065436_com_google_android_apps_docs_PdfViewerActivity.jpg",
        "uploadedAt": "2026-09-15 05:54",
        "category": "accord_leasing",
        "dataUrl": "",
        "id": "doc-1789451699293-omm8",
        "fileType": "image/jpeg"
      }
    ],
    "notes": "⏳ Dossier Leasing avec Accord joint -> Réservation provisoire 5 jours ouvrés.",
    "id": "RES-2026-1016",
    "carName": "Chery I03 4X4",
    "etaDate": "2026-09-15",
    "depositPaidTND": 20000,
    "priceTND": 84900,
    "status": "En attente",
    "commercialId": "comm-marwa",
    "updatedAt": "2026-09-15T05:55:06.224Z",
    "registrationFeeTND": 0,
    "commercialName": "Marwa Frikha",
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "colorChosen": {
          "id": "col-1786454499484",
          "hexCode": "#626a68",
          "name": "Gray GY"
        },
        "requiredDepositTND": 20000,
        "unitPriceTND": 84900,
        "carName": "Chery I03 4X4",
        "totalPriceTND": 84900,
        "carId": "car-1785753208837",
        "id": "v-1789451244336",
        "quantity": 1
      }
    ],
    "createdAt": "2026-09-15T05:55:06.224Z",
    "client": {
      "societe": {
        "raisonSociale": "STE SELOTEC",
        "adresse": "",
        "matriculeFiscale": "1156822A",
        "email": "",
        "ville": "Tunis",
        "registreCommerce": "",
        "telephone": "25169556"
      },
      "type": "societe"
    },
    "expectedDeliveryDate": "2026-10-15",
    "carId": "car-1785753208837",
    "colorChosen": {
      "hexCode": "#626a68",
      "name": "Gray GY",
      "id": "col-1786454499484"
    }
  },
  {
    "commercialId": "user-1787557344213",
    "registrationFeeTND": 0,
    "agency": "Chery Agence Nabeul",
    "depositPaidTND": 8490,
    "status": "Confirmée",
    "createdAt": "2026-09-14T16:13:51.464Z",
    "colorChosen": {
      "id": "col-RES-2026-543",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "carId": "car-1785753208837",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-543)",
    "paymentMethod": "Chèque Certifié",
    "carName": "Chery I03 4X4",
    "etaDate": "2026-11-15",
    "expectedDeliveryDate": "2026-12-15",
    "documents": [],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "96567416",
        "email": "",
        "adresse": ""
      }
    },
    "commercialName": "GODDI CHERY Nabeul",
    "priceTND": 84900,
    "id": "RES-2026-543",
    "vehicles": [
      {
        "id": "veh-RES-2026-543-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-543",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-14T16:13:51.464Z"
  },
  {
    "carName": "Chery I03 4X4",
    "etaDate": "2026-11-15",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "24234000",
        "email": "",
        "adresse": ""
      }
    },
    "depositPaidTND": 8490,
    "colorChosen": {
      "id": "col-RES-2026-228",
      "name": "Green GN",
      "hexCode": "#727783"
    },
    "createdAt": "2026-09-14T16:13:42.786Z",
    "commercialId": "user-1787557344213",
    "carId": "car-1785753208837",
    "status": "Confirmée",
    "paymentMethod": "Chèque Certifié",
    "priceTND": 84900,
    "id": "RES-2026-228",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-228)",
    "expectedDeliveryDate": "2026-12-15",
    "registrationFeeTND": 0,
    "documents": [],
    "commercialName": "GODDI CHERY Nabeul",
    "agency": "Chery Agence Nabeul",
    "vehicles": [
      {
        "id": "veh-RES-2026-228-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-228",
          "name": "Green GN",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-14T16:13:42.786Z"
  },
  {
    "depositPaidTND": 8890,
    "expectedDeliveryDate": "2026-12-15",
    "agency": "Chery Agence Nabeul",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-550)",
    "etaDate": "2026-11-15",
    "carName": "Chery Tiggo 7 PHEV",
    "id": "RES-2026-550",
    "createdAt": "2026-09-14T16:13:28.429Z",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-550",
      "name": "Exclusive Blue WE",
      "hexCode": "#727783"
    },
    "commercialId": "user-1787557344213",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "22 935 734",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "carId": "car-1785753278797",
    "priceTND": 88900,
    "commercialName": "GODDI CHERY Nabeul",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-550-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-550",
          "name": "Exclusive Blue WE",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-14T16:13:28.429Z"
  },
  {
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-11-15",
    "expectedDeliveryDate": "2026-12-15",
    "documents": [],
    "commercialName": "GODDI CHERY Nabeul",
    "status": "Confirmée",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-846)",
    "id": "RES-2026-846",
    "agency": "Chery Agence Nabeul",
    "colorChosen": {
      "id": "col-RES-2026-846",
      "name": "Phantom Gray GV",
      "hexCode": "#727783"
    },
    "paymentMethod": "Chèque Certifié",
    "priceTND": 88900,
    "createdAt": "2026-09-14T16:13:25.244Z",
    "commercialId": "user-1787557344213",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "52368359",
        "email": "",
        "adresse": ""
      }
    },
    "registrationFeeTND": 0,
    "carId": "car-1785753278797",
    "depositPaidTND": 8890,
    "vehicles": [
      {
        "id": "veh-RES-2026-846-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-846",
          "name": "Phantom Gray GV",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-14T16:13:25.244Z"
  },
  {
    "carId": "car-1785753278797",
    "expectedDeliveryDate": "2026-12-15",
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-11-15",
    "documents": [],
    "registrationFeeTND": 0,
    "depositPaidTND": 8890,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "24 393 935",
        "email": "",
        "adresse": ""
      }
    },
    "agency": "Chery Agence Nabeul",
    "commercialName": "GODDI CHERY Nabeul",
    "colorChosen": {
      "id": "col-RES-2026-230",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-14T16:13:13.436Z",
    "priceTND": 88900,
    "id": "RES-2026-230",
    "status": "Confirmée",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-230)",
    "commercialId": "user-1787557344213",
    "vehicles": [
      {
        "id": "veh-RES-2026-230-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-230",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-14T16:13:13.436Z"
  },
  {
    "depositPaidTND": 12990,
    "etaDate": "2026-09-14",
    "carName": "Chery Tiggo 9 PHEV (Tech Gray GX)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "54111672",
        "email": "",
        "adresse": ""
      }
    },
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-1048",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "commercialId": "user-1785739349068",
    "createdAt": "2026-09-14T15:46:09.419Z",
    "carId": "car-1785513071800",
    "vehicles": [
      {
        "id": "veh-RES-2026-1048-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV (Tech Gray GX)",
        "colorChosen": {
          "id": "col-RES-2026-1048",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "status": "Confirmée",
    "priceTND": 129900,
    "id": "RES-2026-1048",
    "updatedAt": "2026-09-14T15:46:09.419Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1048)",
    "documents": [],
    "registrationFeeTND": 0,
    "commercialName": "Nader Chtourou",
    "expectedDeliveryDate": "2026-10-14",
    "agency": "Chery Agence Sfax"
  },
  {
    "agency": "Chery Agence Nabeul",
    "vehicles": [
      {
        "id": "veh-RES-2026-1049-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4 (Black BL)",
        "colorChosen": {
          "id": "col-RES-2026-1049",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "colorChosen": {
      "id": "col-RES-2026-1049",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "createdAt": "2026-09-14T14:50:15.899Z",
    "expectedDeliveryDate": "2026-10-14",
    "depositPaidTND": 8490,
    "registrationFeeTND": 0,
    "carName": "Chery I03 4X4 (Black BL)",
    "etaDate": "2026-09-14",
    "status": "Confirmée",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1049)",
    "carId": "car-1785753208837",
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-1049",
    "commercialName": "GODDI CHERY Nabeul",
    "documents": [],
    "commercialId": "user-1787557344213",
    "updatedAt": "2026-09-14T14:50:15.899Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "27280030",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 84900
  },
  {
    "priceTND": 129900,
    "commercialName": "GODDI CHERY Nabeul",
    "carId": "car-1785513071800",
    "id": "RES-2026-1051",
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-1051",
      "name": "Black CM",
      "hexCode": "#727783"
    },
    "status": "Confirmée",
    "agency": "Chery Agence Nabeul",
    "registrationFeeTND": 0,
    "createdAt": "2026-09-14T14:50:11.112Z",
    "commercialId": "user-1787557344213",
    "carName": "Chery Tiggo 9 PHEV (Black CM)",
    "etaDate": "2026-09-14",
    "updatedAt": "2026-09-14T14:50:11.112Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "27280030",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "depositPaidTND": 12990,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1051)",
    "vehicles": [
      {
        "id": "veh-RES-2026-1051-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV (Black CM)",
        "colorChosen": {
          "id": "col-RES-2026-1051",
          "name": "Black CM",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "expectedDeliveryDate": "2026-10-14"
  },
  {
    "carId": "car-1785753208837",
    "registrationFeeTND": 0,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "27280030",
        "email": "",
        "adresse": ""
      }
    },
    "updatedAt": "2026-09-14T14:50:05.218Z",
    "etaDate": "2026-09-14",
    "carName": "Chery I03 4X4 (Black BL)",
    "priceTND": 84900,
    "commercialName": "GODDI CHERY Nabeul",
    "documents": [],
    "id": "RES-2026-1050",
    "vehicles": [
      {
        "id": "veh-RES-2026-1050-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4 (Black BL)",
        "colorChosen": {
          "id": "col-RES-2026-1050",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "expectedDeliveryDate": "2026-10-14",
    "depositPaidTND": 8490,
    "colorChosen": {
      "id": "col-RES-2026-1050",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "status": "Confirmée",
    "agency": "Chery Agence Nabeul",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-14T14:50:05.218Z",
    "commercialId": "user-1787557344213",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1050)"
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-297)",
    "createdAt": "2026-09-14T14:04:39.923Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Ben Tili",
        "prenom": "Aymen",
        "cin": "",
        "ville": "Tunis",
        "telephone": "+21699578949",
        "email": "",
        "adresse": ""
      }
    },
    "registrationFeeTND": 0,
    "priceTND": 102990,
    "commercialId": "comm-bassem",
    "colorChosen": {
      "id": "col-RES-2026-297",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "etaDate": "2026-09-14",
    "carName": "Chery Tiggo 8 PHEV",
    "depositPaidTND": 10299,
    "expectedDeliveryDate": "2026-10-14",
    "id": "RES-2026-297",
    "commercialName": "Bassem Jerbi",
    "status": "Confirmée",
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "agency": "siege STA",
    "carId": "car-1785753367152",
    "updatedAt": "2026-09-14T14:04:39.923Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-297-0",
        "carId": "car-1785753367152",
        "carName": "Chery Tiggo 8 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-297",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 102990,
        "totalPriceTND": 102990
      }
    ]
  },
  {
    "agency": "Chery Agence Charguia 1",
    "vehicles": [
      {
        "id": "veh-RES-2026-1057-0",
        "unitPriceTND": 84900,
        "carId": "car-1785753208837",
        "colorChosen": {
          "name": "Black BL",
          "hexCode": "#171717",
          "interiorColor": "Cuir Marron",
          "stock": 27,
          "reserved": 8,
          "id": "col-1-1785753208837"
        },
        "totalPriceTND": 84900,
        "carName": "Chery I03 4X4",
        "quantity": 1
      }
    ],
    "createdAt": "2026-09-14T13:28:58.569Z",
    "colorChosen": {
      "name": "Black BL",
      "reserved": 8,
      "interiorColor": "Cuir Marron",
      "stock": 27,
      "id": "col-1-1785753208837",
      "hexCode": "#171717"
    },
    "depositPaidTND": 0,
    "registrationFeeTND": 0,
    "carName": "Chery I03 4X4",
    "status": "Confirmée",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "carId": "car-1785753208837",
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-1057",
    "commercialName": "K2EM CHERY Charguia 1",
    "documents": [],
    "commercialId": "user-1787557525876",
    "updatedAt": "2026-09-14T13:28:58.569Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "telephone": "50011541",
        "nom": "Mariem Hamzaoui",
        "email": "",
        "adresse": "",
        "ville": "Tunis",
        "cin": "",
        "prenom": ""
      }
    },
    "priceTND": 84900
  },
  {
    "commercialId": "comm-moez",
    "expectedDeliveryDate": "2026-10-08",
    "paymentMethod": "Chèque Certifié",
    "commercialName": "Moez Ben Naser",
    "createdAt": "2026-09-14T12:50:33.963Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "21441235",
        "email": "",
        "adresse": ""
      }
    },
    "id": "RES-2026-580",
    "carId": "car-1785753208837",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-580)",
    "depositPaidTND": 8490,
    "agency": "Siege STA",
    "colorChosen": {
      "id": "col-RES-2026-580",
      "name": "Gray GY",
      "hexCode": "#727783"
    },
    "status": "Confirmée",
    "documents": [],
    "registrationFeeTND": 0,
    "carName": "Chery I03 4X4",
    "etaDate": "2026-09-08",
    "priceTND": 84900,
    "vehicles": [
      {
        "id": "veh-RES-2026-580-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-580",
          "name": "Gray GY",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-14T12:50:33.963Z"
  },
  {
    "id": "RES-2026-677",
    "registrationFeeTND": 0,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-677)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "58691667",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "commercialName": "Moez Ben Naser",
    "expectedDeliveryDate": "2026-10-08",
    "paymentMethod": "Chèque Certifié",
    "priceTND": 88900,
    "agency": "Siege STA",
    "depositPaidTND": 8890,
    "etaDate": "2026-09-08",
    "carName": "Chery Tiggo 7 PHEV",
    "carId": "car-1785753278797",
    "commercialId": "comm-moez",
    "status": "Confirmée",
    "createdAt": "2026-09-14T12:50:31.937Z",
    "colorChosen": {
      "id": "col-RES-2026-677",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-677-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-677",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-14T12:50:31.937Z"
  },
  {
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "98760271",
        "email": "",
        "adresse": ""
      }
    },
    "commercialId": "comm-marwa",
    "documents": [],
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "etaDate": "2026-09-14",
    "depositPaidTND": 8890,
    "paymentMethod": "Chèque Certifié",
    "priceTND": 88900,
    "updatedAt": "2026-09-14T11:49:32.628Z",
    "expectedDeliveryDate": "2026-10-14",
    "vehicles": [
      {
        "id": "veh-RES-2026-1047-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Black CL)",
        "colorChosen": {
          "id": "col-RES-2026-1047",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "commercialName": "Marwa Frikha",
    "status": "Confirmée",
    "createdAt": "2026-09-14T11:49:32.628Z",
    "id": "RES-2026-1047",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1047)",
    "registrationFeeTND": 0,
    "agency": "Siege STA",
    "colorChosen": {
      "id": "col-RES-2026-1047",
      "name": "Black CL",
      "hexCode": "#050505"
    }
  },
  {
    "documents": [],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "22308190",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 84900,
    "registrationFeeTND": 0,
    "id": "RES-2026-1046",
    "carId": "car-1785753208837",
    "updatedAt": "2026-09-14T11:33:22.495Z",
    "commercialName": "Ines Chaari",
    "commercialId": "comm-ines",
    "status": "Confirmée",
    "createdAt": "2026-09-14T11:33:22.495Z",
    "etaDate": "2026-09-14",
    "carName": "Chery I03 4X4 (Gray GY)",
    "depositPaidTND": 8490,
    "paymentMethod": "Chèque Certifié",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1046)",
    "expectedDeliveryDate": "2026-10-14",
    "vehicles": [
      {
        "id": "veh-RES-2026-1046-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4 (Gray GY)",
        "colorChosen": {
          "id": "col-RES-2026-1046",
          "name": "Gray GY",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "agency": "Chery Agence Ain Zaghouen",
    "colorChosen": {
      "id": "col-RES-2026-1046",
      "name": "Gray GY",
      "hexCode": "#727783"
    }
  },
  {
    "commercialId": "comm-moez",
    "carName": "Chery Tiggo 7 PHEV",
    "depositPaidTND": 0,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "ville": "Tunis",
        "prenom": "",
        "cin": "",
        "adresse": "",
        "telephone": "98348073",
        "nom": "NAIMA ITELCHKAR",
        "email": ""
      }
    },
    "updatedAt": "2026-09-14T11:32:12.607Z",
    "priceTND": 88900,
    "id": "RES-2026-1056",
    "documents": [],
    "colorChosen": {
      "hexCode": "#217CB5",
      "reserved": 3,
      "stock": 17,
      "name": "Exclusive Blue WE",
      "id": "col-1786454192522",
      "interiorColor": "Cuir Noir"
    },
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1046)",
    "carId": "car-1785753278797",
    "vehicles": [
      {
        "carId": "car-1785753278797",
        "unitPriceTND": 88900,
        "colorChosen": {
          "interiorColor": "Cuir Noir",
          "reserved": 3,
          "id": "col-1786454192522",
          "hexCode": "#217CB5",
          "name": "Exclusive Blue WE",
          "stock": 17
        },
        "quantity": 1,
        "totalPriceTND": 88900,
        "carName": "Chery Tiggo 7 PHEV",
        "id": "veh-RES-2026-1056-0"
      }
    ],
    "status": "Confirmée",
    "agency": "Siege STA",
    "registrationFeeTND": 0,
    "commercialName": "Moez Ben Naser",
    "createdAt": "2026-09-14T11:32:12.607Z",
    "paymentMethod": "Chèque Certifié"
  },
  {
    "createdAt": "2026-09-14T11:26:45.220Z",
    "priceTND": 88900,
    "colorChosen": {
      "id": "col-RES-2026-1044",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "commercialName": "Ines Chaari",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "réservation confirmée #RES-2026-1044 au nom de nck taxi services",
        "prenom": "la",
        "cin": "",
        "ville": "Tunis",
        "telephone": "53437477",
        "email": "",
        "adresse": ""
      }
    },
    "carId": "car-1785753278797",
    "registrationFeeTND": 0,
    "commercialId": "comm-ines",
    "id": "RES-2026-1044",
    "documents": [],
    "depositPaidTND": 8890,
    "agency": "Chery Agence Ain Zaghouen",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1044)",
    "carName": "Chery Tiggo 7 PHEV (White BW)",
    "etaDate": "2026-09-14",
    "status": "Confirmée",
    "updatedAt": "2026-09-14T11:26:45.220Z",
    "expectedDeliveryDate": "2026-10-14",
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "id": "veh-RES-2026-1044-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (White BW)",
        "colorChosen": {
          "id": "col-RES-2026-1044",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ]
  },
  {
    "documents": [],
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-764)",
    "colorChosen": {
      "id": "col-RES-2026-764",
      "name": "Black CM",
      "hexCode": "#727783"
    },
    "priceTND": 129900,
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-764",
    "agency": "Chery Agence Sousse",
    "etaDate": "2026-09-07",
    "carName": "Chery Tiggo 9 PHEV",
    "depositPaidTND": 12990,
    "status": "Confirmée",
    "expectedDeliveryDate": "2026-10-07",
    "createdAt": "2026-09-14T11:26:43.713Z",
    "commercialName": "TAGOURTI CHERY Sousse",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sousse",
        "telephone": "46 353 625",
        "email": "",
        "adresse": ""
      }
    },
    "registrationFeeTND": 0,
    "interiorColorChosen": {
      "id": "int-1787043707010-3",
      "hexCode": "#D4B996",
      "name": "Beige Nappa & Sable"
    },
    "carId": "car-1785513071800",
    "commercialId": "user-1787557462429",
    "vehicles": [
      {
        "id": "veh-RES-2026-764-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-764",
          "name": "Black CM",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-14T11:26:43.713Z"
  },
  {
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sousse",
        "telephone": "27811502",
        "email": "",
        "adresse": ""
      }
    },
    "id": "RES-2026-718",
    "createdAt": "2026-09-14T11:26:35.226Z",
    "depositPaidTND": 12990,
    "carId": "car-1785513071800",
    "carName": "Chery Tiggo 9 PHEV",
    "etaDate": "2026-09-08",
    "priceTND": 129900,
    "commercialId": "user-1787557462429",
    "status": "Confirmée",
    "paymentMethod": "Chèque Certifié",
    "registrationFeeTND": 0,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-718)",
    "commercialName": "TAGOURTI CHERY Sousse",
    "documents": [],
    "colorChosen": {
      "id": "col-RES-2026-718",
      "name": "Black CM",
      "hexCode": "#727783"
    },
    "agency": "Chery Agence Sousse",
    "expectedDeliveryDate": "2026-10-08",
    "vehicles": [
      {
        "id": "veh-RES-2026-718-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-718",
          "name": "Black CM",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-14T11:26:35.226Z"
  },
  {
    "agency": "Chery Agence Sousse",
    "vehicles": [
      {
        "id": "veh-RES-2026-1022-0",
        "carId": "car-1785753150277",
        "carName": "Chery I03 4X2 (Black BL)",
        "colorChosen": {
          "id": "col-RES-2026-1022",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 76900,
        "totalPriceTND": 76900
      }
    ],
    "colorChosen": {
      "id": "col-RES-2026-1022",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "createdAt": "2026-09-14T11:26:20.297Z",
    "expectedDeliveryDate": "2026-10-11",
    "depositPaidTND": 7690,
    "registrationFeeTND": 0,
    "carName": "Chery I03 4X2 (Black BL)",
    "etaDate": "2026-09-11",
    "status": "Confirmée",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1022)",
    "carId": "car-1785753150277",
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-1022",
    "commercialName": "TAGOURTI CHERY Sousse",
    "documents": [],
    "commercialId": "user-1787557462429",
    "updatedAt": "2026-09-14T11:26:20.297Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sousse",
        "telephone": "99643020",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 76900
  },
  {
    "updatedAt": "2026-09-14T11:26:12.826Z",
    "carId": "car-1785753208837",
    "registrationFeeTND": 0,
    "documents": [],
    "priceTND": 84900,
    "id": "RES-2026-1023",
    "commercialName": "TAGOURTI CHERY Sousse",
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-1023",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "expectedDeliveryDate": "2026-10-11",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sousse",
        "telephone": "51999090",
        "email": "",
        "adresse": ""
      }
    },
    "agency": "Chery Agence Sousse",
    "carName": "Chery I03 4X4 (Black BL)",
    "etaDate": "2026-09-11",
    "depositPaidTND": 8490,
    "vehicles": [
      {
        "id": "veh-RES-2026-1023-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4 (Black BL)",
        "colorChosen": {
          "id": "col-RES-2026-1023",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "commercialId": "user-1787557462429",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1023)",
    "createdAt": "2026-09-14T11:26:12.826Z",
    "status": "Confirmée"
  },
  {
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 8990,
    "registrationFeeTND": 0,
    "updatedAt": "2026-09-14T11:25:59.957Z",
    "expectedDeliveryDate": "2026-10-11",
    "status": "Confirmée",
    "agency": "Chery Agence Sousse",
    "documents": [],
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1024)",
    "vehicles": [
      {
        "id": "veh-RES-2026-1024-0",
        "carId": "car-1785512735025",
        "carName": "Chery Arrizo 8 PHEV (Black CL)",
        "colorChosen": {
          "id": "col-RES-2026-1024",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 89900,
        "totalPriceTND": 89900
      }
    ],
    "colorChosen": {
      "id": "col-RES-2026-1024",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "priceTND": 89900,
    "carName": "Chery Arrizo 8 PHEV (Black CL)",
    "etaDate": "2026-09-11",
    "carId": "car-1785512735025",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sousse",
        "telephone": "56215048",
        "email": "",
        "adresse": ""
      }
    },
    "commercialId": "user-1787557462429",
    "id": "RES-2026-1024",
    "createdAt": "2026-09-14T11:25:59.957Z",
    "commercialName": "TAGOURTI CHERY Sousse"
  },
  {
    "documents": [],
    "carName": "Chery I03 4X4",
    "depositPaidTND": 0,
    "carId": "car-1785753208837",
    "id": "RES-2026-1055",
    "vehicles": [
      {
        "id": "veh-RES-2026-1055-0",
        "quantity": 1,
        "unitPriceTND": 84900,
        "carName": "Chery I03 4X4",
        "totalPriceTND": 84900,
        "colorChosen": {
          "interiorColor": "Cuir Marron",
          "reserved": 0,
          "hexCode": "#626a68",
          "id": "col-1786454499484",
          "stock": 30,
          "name": "Gray GY"
        },
        "carId": "car-1785753208837"
      }
    ],
    "commercialId": "user-1787557344213",
    "status": "Confirmée",
    "agency": "Chery Agence Nabeul",
    "colorChosen": {
      "reserved": 0,
      "hexCode": "#626a68",
      "stock": 30,
      "interiorColor": "Cuir Marron",
      "id": "col-1786454499484",
      "name": "Gray GY"
    },
    "updatedAt": "2026-09-14T11:10:08.728Z",
    "createdAt": "2026-09-14T11:10:08.728Z",
    "client": {
      "personnePhysique": {
        "telephone": "22309365",
        "email": "",
        "cin": "",
        "nom": "SLIM CHELLY",
        "ville": "Tunis",
        "prenom": "",
        "adresse": ""
      },
      "type": "personne_physique"
    },
    "priceTND": 84900,
    "paymentMethod": "Chèque Certifié",
    "registrationFeeTND": 0,
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1044)",
    "commercialName": "GODDI CHERY Nabeul"
  },
  {
    "commercialId": "comm-hanen",
    "updatedAt": "2026-09-14T10:08:29.126Z",
    "agency": "Chery Agence Ain Zaghouen",
    "depositPaidTND": 0,
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "id": "RES-2026-1054",
    "registrationFeeTND": 0,
    "documents": [],
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-1786454192522",
      "stock": 17,
      "name": "Exclusive Blue WE",
      "interiorColor": "Cuir Noir",
      "reserved": 3,
      "hexCode": "#217CB5"
    },
    "vehicles": [
      {
        "quantity": 1,
        "colorChosen": {
          "hexCode": "#217CB5",
          "interiorColor": "Cuir Noir",
          "reserved": 3,
          "name": "Exclusive Blue WE",
          "stock": 17,
          "id": "col-1786454192522"
        },
        "carId": "car-1785753278797",
        "unitPriceTND": 88900,
        "carName": "Chery Tiggo 7 PHEV",
        "id": "veh-RES-2026-1054-0",
        "totalPriceTND": 88900
      }
    ],
    "priceTND": 88900,
    "carName": "Chery Tiggo 7 PHEV",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "cin": "",
        "adresse": "",
        "ville": "Tunis",
        "telephone": "29887684",
        "prenom": "",
        "email": "",
        "nom": "la réservation confirmée #RES-2026-1016 au nom de KOBAA SONIA"
      }
    },
    "commercialName": "Hanen Gharbi",
    "carId": "car-1785753278797",
    "createdAt": "2026-09-14T10:08:29.126Z",
    "paymentMethod": "Chèque Certifié"
  },
  {
    "id": "RES-2026-1043",
    "status": "Confirmée",
    "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
    "etaDate": "2026-09-14",
    "colorChosen": {
      "id": "col-RES-2026-1043",
      "name": "Phantom Gray GV",
      "hexCode": "#727783"
    },
    "commercialName": "Ines Chaari",
    "vehicles": [
      {
        "id": "veh-RES-2026-1043-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
        "colorChosen": {
          "id": "col-RES-2026-1043",
          "name": "Phantom Gray GV",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "createdAt": "2026-09-14T07:56:42.318Z",
    "carId": "car-1785753278797",
    "agency": "Chery Agence Ain Zaghouen",
    "commercialId": "comm-ines",
    "priceTND": 88900,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1043)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "24220727",
        "email": "",
        "adresse": ""
      }
    },
    "updatedAt": "2026-09-14T07:56:42.318Z",
    "registrationFeeTND": 0,
    "depositPaidTND": 8890,
    "paymentMethod": "Chèque Certifié",
    "expectedDeliveryDate": "2026-10-14",
    "documents": []
  },
  {
    "expectedDeliveryDate": "2026-10-14",
    "colorChosen": {
      "id": "col-RES-2026-1039",
      "name": "Silver SL",
      "hexCode": "#727783"
    },
    "updatedAt": "2026-09-14T07:52:37.226Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "24246024",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 84900,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1039)",
    "depositPaidTND": 8490,
    "documents": [],
    "registrationFeeTND": 0,
    "etaDate": "2026-09-14",
    "carName": "Chery I03 4X4 (Silver SL)",
    "commercialName": "Ines Chaari",
    "status": "Confirmée",
    "carId": "car-1785753208837",
    "vehicles": [
      {
        "id": "veh-RES-2026-1039-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4 (Silver SL)",
        "colorChosen": {
          "id": "col-RES-2026-1039",
          "name": "Silver SL",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "agency": "Chery Agence Ain Zaghouen",
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-1039",
    "createdAt": "2026-09-14T07:52:37.226Z",
    "commercialId": "comm-ines"
  },
  {
    "colorChosen": {
      "id": "col-RES-2026-1038",
      "name": "Phantom Gray GV",
      "hexCode": "#727783"
    },
    "id": "RES-2026-1038",
    "priceTND": 88900,
    "expectedDeliveryDate": "2026-10-14",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "58541226",
        "email": "",
        "adresse": ""
      }
    },
    "depositPaidTND": 8890,
    "carId": "car-1785753278797",
    "etaDate": "2026-09-14",
    "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
    "createdAt": "2026-09-14T07:49:09.954Z",
    "updatedAt": "2026-09-14T07:49:09.954Z",
    "status": "Confirmée",
    "paymentMethod": "Chèque Certifié",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1038)",
    "vehicles": [
      {
        "id": "veh-RES-2026-1038-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Phantom Gray GV)",
        "colorChosen": {
          "id": "col-RES-2026-1038",
          "name": "Phantom Gray GV",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "documents": [],
    "agency": "Chery Agence Ain Zaghouen",
    "commercialName": "Ines Chaari",
    "commercialId": "comm-ines",
    "registrationFeeTND": 0
  },
  {
    "client": {
      "personnePhysique": {
        "ville": "Tunis",
        "email": "",
        "cin": "02599456",
        "prenom": "hatem ",
        "nom": "mraidi",
        "telephone": "98260918",
        "adresse": ""
      },
      "type": "personne_physique"
    },
    "registrationFeeTND": 0,
    "id": "RES-2026-1037",
    "paymentMethod": "Leasing",
    "etaDate": "2026-09-14",
    "priceTND": 129900,
    "notes": "⚡ Dossier Leasing avec Bon de Commande joint -> Réservation validée sans acompte requis.",
    "commercialName": "Ines Chaari",
    "agency": "Chery Agence Ain Zaghouen",
    "depositPaidTND": 0,
    "colorChosen": {
      "name": "Huanyu Gray",
      "hexCode": "#A1A1A1",
      "id": "col-1786981512703"
    },
    "carId": "car-1785513071800",
    "createdAt": "2026-09-14T07:45:03.624Z",
    "commercialId": "comm-ines",
    "carName": "Chery Tiggo 9 PHEV",
    "status": "Confirmée",
    "vehicles": [
      {
        "unitPriceTND": 129900,
        "requiredDepositTND": 50000,
        "carName": "Chery Tiggo 9 PHEV",
        "totalPriceTND": 129900,
        "quantity": 1,
        "id": "v-1789371789613",
        "colorChosen": {
          "hexCode": "#A1A1A1",
          "id": "col-1786981512703",
          "name": "Huanyu Gray"
        },
        "carId": "car-1785513071800"
      }
    ],
    "updatedAt": "2026-09-14T07:45:03.624Z",
    "documents": [
      {
        "id": "doc-1789371861140-e2mg",
        "category": "cin_recto",
        "uploadedAt": "2026-09-14 07:44",
        "sizeFormatted": "0.29 MB",
        "fileType": "image/jpeg",
        "name": "mraidi hatem cin.jpeg",
        "dataUrl": ""
      },
      {
        "fileType": "image/jpeg",
        "dataUrl": "",
        "uploadedAt": "2026-09-14 07:45",
        "name": "bc mraidi hatem.jpeg",
        "category": "bon_commande",
        "sizeFormatted": "0.12 MB",
        "id": "doc-1789371900924-h8p0"
      }
    ],
    "expectedDeliveryDate": "2026-10-14"
  },
  {
    "id": "RES-2026-1025",
    "commercialId": "user-1787821380306",
    "commercialName": "Racha Jebeniani",
    "agency": "Chery siege",
    "carId": "car-1785753367152",
    "carName": "Chery Tiggo 8 PHEV",
    "colorChosen": {
      "id": "col-1-1785753367152",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-1025-0",
        "carId": "car-1785753367152",
        "carName": "Chery Tiggo 8 PHEV",
        "colorChosen": {
          "id": "col-1-1785753367152",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 102990,
        "totalPriceTND": 102990
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "priceTND": 102990,
    "registrationFeeTND": 0,
    "depositPaidTND": 40000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-14T07:37:35.031Z",
    "updatedAt": "2026-09-14T07:37:35.031Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1025)"
  },
  {
    "id": "RES-2026-1026",
    "commercialId": "user-1787821380306",
    "commercialName": "Racha Jebeniani",
    "agency": "Chery siege",
    "carId": "car-1785753367152",
    "carName": "Chery Tiggo 8 PHEV",
    "colorChosen": {
      "id": "col-1-1785753367152",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-1026-0",
        "carId": "car-1785753367152",
        "carName": "Chery Tiggo 8 PHEV",
        "colorChosen": {
          "id": "col-1-1785753367152",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 102990,
        "totalPriceTND": 102990
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "priceTND": 102990,
    "registrationFeeTND": 0,
    "depositPaidTND": 40000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-14T07:37:08.232Z",
    "updatedAt": "2026-09-14T07:37:08.232Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1026)"
  },
  {
    "id": "RES-2026-1032",
    "commercialId": "user-1787821380306",
    "commercialName": "Racha Jebeniani",
    "agency": "Chery siege",
    "carId": "car-1785514106502",
    "carName": "Chery Himla 4X4 BVM",
    "colorChosen": {
      "id": "col-1786981947069",
      "name": "Black CH",
      "hexCode": "#0A0A0A"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-1032-0",
        "carId": "car-1785514106502",
        "carName": "Chery Himla 4X4 BVM",
        "colorChosen": {
          "id": "col-1786981947069",
          "name": "Black CH",
          "hexCode": "#0A0A0A"
        },
        "quantity": 1,
        "unitPriceTND": 102900,
        "totalPriceTND": 102900
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "priceTND": 102900,
    "registrationFeeTND": 0,
    "depositPaidTND": 20000,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-14T07:36:23.998Z",
    "updatedAt": "2026-09-14T07:36:23.998Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1032)"
  },
  {
    "commercialName": "Ines Chaari",
    "id": "RES-2026-1036",
    "agency": "Chery Agence Ain Zaghouen",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1036)",
    "status": "Confirmée",
    "vehicles": [
      {
        "id": "veh-RES-2026-1036-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4 (Green GN)",
        "colorChosen": {
          "id": "col-RES-2026-1036",
          "name": "Green GN",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "createdAt": "2026-09-14T07:27:27.588Z",
    "registrationFeeTND": 0,
    "colorChosen": {
      "id": "col-RES-2026-1036",
      "name": "Green GN",
      "hexCode": "#727783"
    },
    "priceTND": 84900,
    "expectedDeliveryDate": "2026-10-14",
    "paymentMethod": "Chèque Certifié",
    "updatedAt": "2026-09-14T07:27:27.588Z",
    "carName": "Chery I03 4X4 (Green GN)",
    "etaDate": "2026-09-14",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "29945939",
        "email": "",
        "adresse": ""
      }
    },
    "commercialId": "comm-ines",
    "carId": "car-1785753208837",
    "documents": [],
    "depositPaidTND": 8490
  },
  {
    "expectedDeliveryDate": "2026-10-08",
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "carId": "car-1785753208837",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "56138666",
        "email": "",
        "adresse": ""
      }
    },
    "commercialId": "comm-ines",
    "commercialName": "Ines Chaari",
    "colorChosen": {
      "id": "col-RES-2026-124",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "createdAt": "2026-09-14T06:45:28.909Z",
    "depositPaidTND": 8490,
    "id": "RES-2026-124",
    "status": "Confirmée",
    "etaDate": "2026-09-08",
    "carName": "Chery I03 4X4",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-124)",
    "agency": "Chery Agence Ain Zaghouen",
    "priceTND": 84900,
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-124-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-124",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-14T06:45:28.909Z"
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-414)",
    "id": "RES-2026-414",
    "agency": "Chery Agence Ain Zaghouen",
    "status": "Confirmée",
    "commercialName": "Ines Chaari",
    "createdAt": "2026-09-14T06:45:19.623Z",
    "expectedDeliveryDate": "2026-10-08",
    "depositPaidTND": 8490,
    "registrationFeeTND": 0,
    "carName": "Chery I03 4X4",
    "etaDate": "2026-09-08",
    "paymentMethod": "Chèque Certifié",
    "commercialId": "comm-ines",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "24282870",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 84900,
    "documents": [],
    "carId": "car-1785753208837",
    "colorChosen": {
      "id": "col-RES-2026-414",
      "name": "Gray GY",
      "hexCode": "#727783"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-414-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-414",
          "name": "Gray GY",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-14T06:45:19.623Z"
  },
  {
    "id": "RES-2026-998",
    "agency": "Chery Agence Djerba",
    "vehicles": [
      {
        "id": "veh-RES-2026-998-0",
        "carId": "car-1785514106502",
        "carName": "Chery Himla 4X4 BVM (Silver Gray GR)",
        "colorChosen": {
          "id": "col-RES-2026-998",
          "name": "Silver Gray GR",
          "hexCode": "#BFBFBF"
        },
        "quantity": 1,
        "unitPriceTND": 102900,
        "totalPriceTND": 102900
      }
    ],
    "commercialId": "user-1787557295837",
    "depositPaidTND": 10290,
    "registrationFeeTND": 0,
    "etaDate": "2026-09-10",
    "carName": "Chery Himla 4X4 BVM (Silver Gray GR)",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-998",
      "name": "Silver Gray GR",
      "hexCode": "#BFBFBF"
    },
    "createdAt": "2026-09-12T08:38:44.834Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-998)",
    "carId": "car-1785514106502",
    "updatedAt": "2026-09-12T08:38:44.834Z",
    "paymentMethod": "Chèque Certifié",
    "commercialName": "LCA CHERY Djerba",
    "expectedDeliveryDate": "2026-10-10",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "58173299",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "priceTND": 102900
  },
  {
    "carId": "car-1785753208837",
    "id": "RES-2026-369",
    "createdAt": "2026-09-12T07:23:10.829Z",
    "status": "Confirmée",
    "agency": "Chery Agence Nabeul",
    "carName": "Chery I03 4X4",
    "etaDate": "2026-11-15",
    "commercialName": "GODDI CHERY Nabeul",
    "colorChosen": {
      "id": "col-RES-2026-369",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "registrationFeeTND": 0,
    "commercialId": "user-1787557344213",
    "paymentMethod": "Chèque Certifié",
    "expectedDeliveryDate": "2026-12-15",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "92 606 075",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "depositPaidTND": 8490,
    "priceTND": 84900,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-369)",
    "vehicles": [
      {
        "id": "veh-RES-2026-369-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-369",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-12T07:23:10.829Z"
  },
  {
    "depositPaidTND": 8890,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-136)",
    "priceTND": 88900,
    "createdAt": "2026-09-12T07:21:41.091Z",
    "agency": "Chery Agence Nabeul",
    "etaDate": "2026-11-15",
    "carName": "Chery Tiggo 7 PHEV",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-136",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "documents": [],
    "expectedDeliveryDate": "2026-12-15",
    "id": "RES-2026-136",
    "commercialId": "user-1787557344213",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "29151903",
        "email": "",
        "adresse": ""
      }
    },
    "commercialName": "GODDI CHERY Nabeul",
    "carId": "car-1785753278797",
    "registrationFeeTND": 0,
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "id": "veh-RES-2026-136-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-136",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-12T07:21:41.091Z"
  },
  {
    "commercialId": "user-1787557344213",
    "commercialName": "GODDI CHERY Nabeul",
    "documents": [],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "99180885",
        "email": "",
        "adresse": ""
      }
    },
    "carId": "car-1785753278797",
    "expectedDeliveryDate": "2026-12-15",
    "registrationFeeTND": 0,
    "createdAt": "2026-09-12T07:21:24.586Z",
    "priceTND": 88900,
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery Agence Nabeul",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-141)",
    "etaDate": "2026-11-15",
    "carName": "Chery Tiggo 7 PHEV",
    "colorChosen": {
      "id": "col-RES-2026-141",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "id": "RES-2026-141",
    "status": "Confirmée",
    "depositPaidTND": 8890,
    "vehicles": [
      {
        "id": "veh-RES-2026-141-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-141",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-12T07:21:24.586Z"
  },
  {
    "documents": [],
    "status": "Confirmée",
    "agency": "Siege STA",
    "carName": "Chery Tiggo 7 PHEV",
    "commercialName": "Marwa Frikha",
    "priceTND": 88900,
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "updatedAt": "2026-09-11T16:36:43.359Z",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-1053-0",
        "carName": "Chery Tiggo 7 PHEV",
        "quantity": 1,
        "unitPriceTND": 88900,
        "carId": "car-1785753278797",
        "totalPriceTND": 88900,
        "colorChosen": {
          "id": "col-3-1785753278797",
          "hexCode": "#727783",
          "stock": 14,
          "reserved": 11,
          "name": "Tech Gray GX",
          "interiorColor": "Cuir Noir"
        }
      }
    ],
    "carId": "car-1785753278797",
    "paymentMethod": "Chèque Certifié",
    "commercialId": "comm-marwa",
    "colorChosen": {
      "reserved": 11,
      "hexCode": "#727783",
      "stock": 14,
      "name": "Tech Gray GX",
      "id": "col-3-1785753278797",
      "interiorColor": "Cuir Noir"
    },
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "ville": "Tunis",
        "telephone": "98164501",
        "cin": "",
        "prenom": "",
        "nom": "la réservation confirmée #RES-2026-1016 au nom de MOUADH KOURAICHI",
        "adresse": "",
        "email": ""
      }
    },
    "depositPaidTND": 0,
    "createdAt": "2026-09-11T16:36:43.359Z",
    "id": "RES-2026-1053"
  },
  {
    "carName": "Chery Tiggo 7 PHEV",
    "depositPaidTND": 0,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "prenom": "",
        "email": "",
        "nom": "MEHDI EN ABDELAZIZ HABIB",
        "adresse": "",
        "cin": "",
        "telephone": "98410686",
        "ville": "Sfax"
      }
    },
    "documents": [],
    "id": "RES-2026-1034",
    "priceTND": 88900,
    "updatedAt": "2026-09-11T15:37:30.093Z",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "colorChosen": {
      "interiorColor": "Cuir Noir",
      "stock": 27,
      "name": "Black CL",
      "id": "col-1786454139529",
      "hexCode": "#050505",
      "reserved": 3
    },
    "carId": "car-1785753278797",
    "createdAt": "2026-09-11T15:37:30.093Z",
    "vehicles": [
      {
        "carName": "Chery Tiggo 7 PHEV",
        "carId": "car-1785753278797",
        "colorChosen": {
          "stock": 27,
          "name": "Black CL",
          "interiorColor": "Cuir Noir",
          "id": "col-1786454139529",
          "hexCode": "#050505",
          "reserved": 3
        },
        "unitPriceTND": 88900,
        "id": "veh-RES-2026-1034-0",
        "totalPriceTND": 88900,
        "quantity": 1
      }
    ],
    "status": "Confirmée",
    "commercialName": "DISTRICARS Sfax",
    "agency": "Chery Agence Sfax",
    "registrationFeeTND": 0,
    "paymentMethod": "Chèque Certifié",
    "commercialId": "user-1787557241636"
  },
  {
    "vehicles": [
      {
        "id": "veh-RES-2026-1021-0",
        "carId": "car-1785753367152",
        "carName": "Chery Tiggo 8 PHEV (Black CL)",
        "colorChosen": {
          "id": "col-RES-2026-1021",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 102990,
        "totalPriceTND": 102990
      }
    ],
    "expectedDeliveryDate": "2026-10-11",
    "depositPaidTND": 10299,
    "colorChosen": {
      "id": "col-RES-2026-1021",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "98568470",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1021)",
    "registrationFeeTND": 0,
    "updatedAt": "2026-09-11T15:33:39.582Z",
    "commercialId": "user-1787557344213",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-11T15:33:39.582Z",
    "status": "Confirmée",
    "carId": "car-1785753367152",
    "carName": "Chery Tiggo 8 PHEV (Black CL)",
    "etaDate": "2026-09-11",
    "agency": "Chery Agence Nabeul",
    "id": "RES-2026-1021",
    "priceTND": 102990,
    "commercialName": "GODDI CHERY Nabeul"
  },
  {
    "colorChosen": {
      "id": "col-RES-2026-1020",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "agency": "Chery Agence Sfax",
    "id": "RES-2026-1020",
    "createdAt": "2026-09-11T15:10:10.311Z",
    "commercialName": "DISTRICARS Sfax",
    "paymentMethod": "Chèque Certifié",
    "etaDate": "2026-09-11",
    "carName": "Chery Tiggo 7 PHEV (Tech Gray GX)",
    "status": "Confirmée",
    "priceTND": 88900,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1020)",
    "registrationFeeTND": 0,
    "updatedAt": "2026-09-11T15:10:10.311Z",
    "carId": "car-1785753278797",
    "vehicles": [
      {
        "id": "veh-RES-2026-1020-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Tech Gray GX)",
        "colorChosen": {
          "id": "col-RES-2026-1020",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "depositPaidTND": 8890,
    "documents": [],
    "expectedDeliveryDate": "2026-10-11",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "26520527",
        "email": "",
        "adresse": ""
      }
    },
    "commercialId": "user-1787557241636"
  },
  {
    "commercialName": "Racha Jebeniani",
    "documents": [],
    "agency": "Chery siege",
    "vehicles": [
      {
        "id": "veh-RES-2026-1019-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4 (Silver SL)",
        "colorChosen": {
          "id": "col-RES-2026-1019",
          "name": "Silver SL",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "colorChosen": {
      "id": "col-RES-2026-1019",
      "name": "Silver SL",
      "hexCode": "#727783"
    },
    "status": "Confirmée",
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-1019",
    "carId": "car-1785753208837",
    "updatedAt": "2026-09-28T10:15:29.158Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1019)",
    "createdAt": "2026-09-11T14:46:35.606Z",
    "carName": "Chery I03 4X4 (Silver SL)",
    "etaDate": "2026-09-11",
    "expectedDeliveryDate": "2026-10-11",
    "registrationFeeTND": 0,
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE LES TANNERIES TUNISIENNE",
        "matriculeFiscale": "0011880D",
        "telephone": "29985515",
        "email": "",
        "ville": "Tunis",
        "adresse": "",
        "registreCommerce": ""
      }
    },
    "priceTND": 84900,
    "depositPaidTND": 20000,
    "commercialId": "user-1787821380306"
  },
  {
    "colorChosen": {
      "stock": 15,
      "name": "Black BL",
      "id": "col-1-1785753150277",
      "reserved": 5,
      "hexCode": "#171717",
      "interiorColor": "Cuir Marron"
    },
    "documents": [],
    "commercialId": "user-1787557525876",
    "status": "Confirmée",
    "agency": "Chery Agence Charguia 1",
    "paymentMethod": "Chèque Certifié",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1018)",
    "vehicles": [
      {
        "id": "veh-RES-2026-1052-0",
        "quantity": 1,
        "colorChosen": {
          "stock": 15,
          "name": "Black BL",
          "id": "col-1-1785753150277",
          "hexCode": "#171717",
          "reserved": 5,
          "interiorColor": "Cuir Marron"
        },
        "unitPriceTND": 76900,
        "carId": "car-1785753150277",
        "totalPriceTND": 76900,
        "carName": "Chery I03 4X2"
      }
    ],
    "commercialName": "K2EM CHERY Charguia 1",
    "updatedAt": "2026-09-11T14:12:15.859Z",
    "id": "RES-2026-1052",
    "priceTND": 76900,
    "carName": "Chery I03 4X2",
    "depositPaidTND": 0,
    "carId": "car-1785753150277",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "email": "",
        "telephone": "98529065",
        "adresse": "",
        "nom": "Faten Laajili",
        "prenom": "",
        "cin": "",
        "ville": "Tunis"
      }
    },
    "createdAt": "2026-09-11T14:12:15.859Z",
    "registrationFeeTND": 0
  },
  {
    "status": "Confirmée",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1000)",
    "commercialId": "user-1787557525876",
    "vehicles": [
      {
        "unitPriceTND": 84900,
        "quantity": 1,
        "id": "veh-RES-2026-1083-0",
        "totalPriceTND": 84900,
        "colorChosen": {
          "id": "col-1-1785753208837",
          "hexCode": "#171717",
          "interiorColor": "Cuir Marron",
          "reserved": 8,
          "name": "Black BL",
          "stock": 27
        },
        "carName": "Chery I03 4X4",
        "carId": "car-1785753208837"
      }
    ],
    "carName": "Chery I03 4X4",
    "paymentMethod": "Chèque Certifié",
    "commercialName": "K2EM CHERY Charguia 1",
    "createdAt": "2026-09-11T12:58:20.639Z",
    "agency": "Chery Agence Charguia 1",
    "depositPaidTND": 0,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "prenom": "",
        "nom": "Jamila Souir",
        "adresse": "",
        "ville": "Tunis",
        "telephone": "58439960",
        "email": "",
        "cin": ""
      }
    },
    "priceTND": 84900,
    "updatedAt": "2026-09-11T12:58:20.639Z",
    "registrationFeeTND": 0,
    "id": "RES-2026-1083",
    "colorChosen": {
      "interiorColor": "Cuir Marron",
      "reserved": 8,
      "name": "Black BL",
      "id": "col-1-1785753208837",
      "hexCode": "#171717",
      "stock": 27
    },
    "documents": [],
    "carId": "car-1785753208837"
  },
  {
    "createdAt": "2026-09-11T11:18:53.872Z",
    "commercialId": "user-1787557295837",
    "status": "Confirmée",
    "colorChosen": {
      "stock": 16,
      "name": "Silver Gray GR",
      "interiorColor": "Cuir Noir",
      "reserved": 2,
      "id": "col-1-1785514106502",
      "hexCode": "#BFBFBF"
    },
    "carName": "Chery Himla 4X4 BVM",
    "commercialName": "LCA CHERY Djerba",
    "agency": "Chery Agence Djerba",
    "priceTND": 102900,
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-998)",
    "vehicles": [
      {
        "unitPriceTND": 102900,
        "id": "veh-RES-2026-1082-0",
        "carName": "Chery Himla 4X4 BVM",
        "carId": "car-1785514106502",
        "quantity": 1,
        "colorChosen": {
          "reserved": 2,
          "interiorColor": "Cuir Noir",
          "name": "Silver Gray GR",
          "hexCode": "#BFBFBF",
          "stock": 16,
          "id": "col-1-1785514106502"
        },
        "totalPriceTND": 102900
      }
    ],
    "registrationFeeTND": 0,
    "carId": "car-1785514106502",
    "documents": [],
    "depositPaidTND": 20000,
    "client": {
      "personnePhysique": {
        "prenom": "",
        "email": "",
        "cin": "",
        "telephone": "58173299",
        "ville": "Tunis",
        "adresse": "",
        "nom": "NABIL MOSLAH"
      },
      "type": "personne_physique"
    },
    "updatedAt": "2026-09-11T11:18:53.872Z",
    "id": "RES-2026-1082",
    "paymentMethod": "Chèque Certifié"
  },
  {
    "priceTND": 129900,
    "updatedAt": "2026-09-11T10:30:23.798Z",
    "status": "Confirmée",
    "etaDate": "2026-11-15",
    "carName": "Chery Tiggo 9 PHEV",
    "id": "RES-2026-915",
    "colorChosen": {
      "id": "col-RES-2026-915",
      "name": "Huanyu Gray",
      "hexCode": "#727783"
    },
    "paymentMethod": "Chèque Certifié",
    "expectedDeliveryDate": "2026-12-15",
    "documents": [],
    "carId": "car-1785513071800",
    "agency": "Siege STA",
    "depositPaidTND": 12990,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-915)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Tunis",
        "telephone": "55265666",
        "email": "",
        "adresse": ""
      }
    },
    "registrationFeeTND": 0,
    "commercialName": "Mongi Jamaï",
    "commercialId": "comm-superadmin",
    "createdAt": "2026-09-11T10:30:23.798Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-915-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-915",
          "name": "Huanyu Gray",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ]
  },
  {
    "commercialName": "Ines Chaari",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1016)",
    "documents": [],
    "agency": "Chery Agence Ain Zaghouen",
    "status": "Confirmée",
    "updatedAt": "2026-09-11T10:21:54.587Z",
    "priceTND": 88900,
    "commercialId": "comm-ines",
    "vehicles": [
      {
        "quantity": 1,
        "id": "veh-RES-2026-1033-0",
        "carId": "car-1785753278797",
        "colorChosen": {
          "name": "Tech Gray GX",
          "reserved": 13,
          "interiorColor": "Cuir Noir",
          "stock": 12,
          "hexCode": "#727783",
          "id": "col-3-1785753278797"
        },
        "totalPriceTND": 88900,
        "unitPriceTND": 88900,
        "carName": "Chery Tiggo 7 PHEV"
      }
    ],
    "id": "RES-2026-1033",
    "createdAt": "2026-09-11T10:21:54.587Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "prenom": "",
        "ville": "Tunis",
        "cin": "",
        "nom": "LASSAD  RHIMI",
        "adresse": "",
        "telephone": "25169556",
        "email": ""
      }
    },
    "colorChosen": {
      "reserved": 13,
      "stock": 12,
      "name": "Tech Gray GX",
      "id": "col-3-1785753278797",
      "hexCode": "#727783",
      "interiorColor": "Cuir Noir"
    },
    "carId": "car-1785753278797",
    "registrationFeeTND": 0,
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 0,
    "carName": "Chery Tiggo 7 PHEV"
  },
  {
    "documents": [],
    "updatedAt": "2026-09-11T10:08:22.476Z",
    "carId": "car-1785514106502",
    "id": "RES-2026-1042",
    "commercialId": "user-1787821380306",
    "colorChosen": {
      "reserved": 2,
      "hexCode": "#0A0A0A",
      "name": "Black CH",
      "interiorColor": "Cuir Noir",
      "id": "col-1786981947069",
      "stock": 16
    },
    "createdAt": "2026-09-11T10:08:22.476Z",
    "client": {
      "personnePhysique": {
        "adresse": "",
        "cin": "",
        "ville": "Tunis",
        "email": "",
        "prenom": "",
        "telephone": "02176310",
        "nom": "HOUCINE BEN ALI HAMADI"
      },
      "type": "personne_physique"
    },
    "depositPaidTND": 20000,
    "vehicles": [
      {
        "carId": "car-1785514106502",
        "id": "veh-RES-2026-1042-0",
        "colorChosen": {
          "hexCode": "#0A0A0A",
          "id": "col-1786981947069",
          "name": "Black CH",
          "interiorColor": "Cuir Noir",
          "stock": 16,
          "reserved": 2
        },
        "quantity": 1,
        "unitPriceTND": 102900,
        "totalPriceTND": 102900,
        "carName": "Chery Himla 4X4 BVM"
      }
    ],
    "registrationFeeTND": 0,
    "priceTND": 102900,
    "status": "Confirmée",
    "carName": "Chery Himla 4X4 BVM",
    "commercialName": "Racha Jebeniani",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-998)",
    "agency": "Chery siege",
    "paymentMethod": "Chèque Certifié"
  },
  {
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Chery",
        "prenom": "Client",
        "cin": "",
        "ville": "Sfax",
        "telephone": "52355837",
        "email": "",
        "adresse": ""
      }
    },
    "registrationFeeTND": 0,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1015)",
    "commercialName": "DISTRICARS Sfax",
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "id": "veh-RES-2026-1015-0",
        "carId": "car-1785753367152",
        "carName": "Chery Tiggo 8 PHEV (Green SJ)",
        "colorChosen": {
          "id": "col-RES-2026-1015",
          "name": "Green SJ",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 102990,
        "totalPriceTND": 102990
      }
    ],
    "createdAt": "2026-09-11T09:02:31.462Z",
    "id": "RES-2026-1015",
    "commercialId": "user-1787557241636",
    "status": "Confirmée",
    "priceTND": 102990,
    "updatedAt": "2026-09-11T09:02:31.462Z",
    "colorChosen": {
      "id": "col-RES-2026-1015",
      "name": "Green SJ",
      "hexCode": "#727783"
    },
    "carName": "Chery Tiggo 8 PHEV (Green SJ)",
    "etaDate": "2026-09-11",
    "depositPaidTND": 10299,
    "carId": "car-1785753367152",
    "agency": "Chery Agence Sfax",
    "documents": [],
    "expectedDeliveryDate": "2026-10-11"
  },
  {
    "agency": "Chery Agence Sfax",
    "vehicles": [
      {
        "id": "veh-RES-2026-1014-0",
        "carId": "car-1785753367152",
        "carName": "Chery Tiggo 8 PHEV (White BW)",
        "colorChosen": {
          "id": "col-RES-2026-1014",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 102990,
        "totalPriceTND": 102990
      }
    ],
    "createdAt": "2026-09-11T08:59:22.960Z",
    "colorChosen": {
      "id": "col-RES-2026-1014",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "expectedDeliveryDate": "2026-10-11",
    "depositPaidTND": 10299,
    "registrationFeeTND": 0,
    "etaDate": "2026-09-11",
    "carName": "Chery Tiggo 8 PHEV (White BW)",
    "status": "En attente",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1014)",
    "carId": "car-1785753367152",
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-1014",
    "commercialName": "DISTRICARS Sfax",
    "documents": [],
    "commercialId": "user-1787557241636",
    "updatedAt": "2026-09-11T08:59:22.960Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "CHAABEN",
        "prenom": "JAWHER",
        "cin": "",
        "ville": "Sfax",
        "telephone": "52355837",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 102990
  },
  {
    "agency": "Chery Agence Ain Zaghouen",
    "vehicles": [
      {
        "totalPriceTND": 88900,
        "colorChosen": {
          "id": "col-1786454192522",
          "stock": 17,
          "name": "Exclusive Blue WE",
          "interiorColor": "Cuir Noir",
          "reserved": 3,
          "hexCode": "#217CB5"
        },
        "id": "veh-RES-2026-1031-0",
        "quantity": 1,
        "unitPriceTND": 88900,
        "carName": "Chery Tiggo 7 PHEV",
        "carId": "car-1785753278797"
      }
    ],
    "createdAt": "2026-09-11T08:36:05.247Z",
    "colorChosen": {
      "name": "Exclusive Blue WE",
      "reserved": 3,
      "interiorColor": "Cuir Noir",
      "id": "col-1786454192522",
      "stock": 17,
      "hexCode": "#217CB5"
    },
    "depositPaidTND": 0,
    "registrationFeeTND": 0,
    "carName": "Chery Tiggo 7 PHEV",
    "status": "Confirmée",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1014)",
    "carId": "car-1785753278797",
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-1031",
    "commercialName": "Hanen Gharbi",
    "documents": [],
    "commercialId": "comm-hanen",
    "updatedAt": "2026-09-11T08:36:05.247Z",
    "client": {
      "type": "societe",
      "societe": {
        "matriculeFiscale": "",
        "email": "",
        "adresse": "",
        "ville": "Tunis",
        "raisonSociale": "la réservation confirmée #RES-2026-1014 au nom de STE GLOBALE GENERAL SERVICE",
        "telephone": "97333666"
      }
    },
    "priceTND": 88900
  },
  {
    "id": "RES-2026-1030",
    "client": {
      "personnePhysique": {
        "nom": "OTHMEN  NAKOURI",
        "prenom": "",
        "telephone": "51300100",
        "cin": "",
        "ville": "Sousse",
        "email": "",
        "adresse": ""
      },
      "type": "personne_physique"
    },
    "vehicles": [
      {
        "quantity": 1,
        "carId": "car-1785753208837",
        "unitPriceTND": 84900,
        "colorChosen": {
          "interiorColor": "Cuir Marron",
          "name": "Green GN",
          "reserved": 1,
          "stock": 9,
          "hexCode": "#255645",
          "id": "col-1786454514433"
        },
        "id": "veh-RES-2026-1030-0",
        "carName": "Chery I03 4X4",
        "totalPriceTND": 84900
      }
    ],
    "depositPaidTND": 20000,
    "createdAt": "2026-09-11T08:28:21.202Z",
    "carId": "car-1785753208837",
    "colorChosen": {
      "hexCode": "#255645",
      "interiorColor": "Cuir Marron",
      "stock": 9,
      "name": "Green GN",
      "id": "col-1786454514433",
      "reserved": 1
    },
    "paymentMethod": "Chèque Certifié",
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "carName": "Chery I03 4X4",
    "updatedAt": "2026-09-11T08:28:21.202Z",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-998)",
    "documents": [],
    "commercialId": "user-1787557462429",
    "commercialName": "TAGOURTI CHERY Sousse",
    "priceTND": 84900,
    "agency": "Chery Agence Sousse"
  },
  {
    "depositPaidTND": 0,
    "colorChosen": {
      "id": "col-3-1785753278797",
      "name": "Tech Gray GX",
      "interiorColor": "Cuir Noir",
      "hexCode": "#727783",
      "stock": 12,
      "reserved": 13
    },
    "paymentMethod": "Chèque Certifié",
    "documents": [],
    "id": "RES-2026-1029",
    "commercialId": "user-1787557384756",
    "carName": "Chery Tiggo 7 PHEV",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1014)",
    "client": {
      "personnePhysique": {
        "telephone": "29711834",
        "prenom": "",
        "nom": "Kilani Naoufel",
        "ville": "Tunis",
        "email": "",
        "cin": "",
        "adresse": ""
      },
      "type": "personne_physique"
    },
    "priceTND": 88900,
    "updatedAt": "2026-09-11T08:15:26.781Z",
    "registrationFeeTND": 0,
    "agency": "Chery Agence Nabeul",
    "vehicles": [
      {
        "quantity": 1,
        "unitPriceTND": 88900,
        "carId": "car-1785753278797",
        "id": "veh-RES-2026-1029-0",
        "colorChosen": {
          "hexCode": "#727783",
          "id": "col-3-1785753278797",
          "interiorColor": "Cuir Noir",
          "reserved": 13,
          "name": "Tech Gray GX",
          "stock": 12
        },
        "totalPriceTND": 88900,
        "carName": "Chery Tiggo 7 PHEV"
      }
    ],
    "createdAt": "2026-09-11T08:15:26.781Z",
    "carId": "car-1785753278797",
    "status": "Confirmée",
    "commercialName": "S2A CHERY Gabes"
  },
  {
    "colorChosen": {
      "id": "col-RES-2026-1001",
      "name": "Exclusive Blue WE",
      "hexCode": "#727783"
    },
    "carId": "car-1785753278797",
    "commercialId": "comm-hanen",
    "priceTND": 88900,
    "createdAt": "2026-09-11T08:03:19.838Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "MR SAID",
        "prenom": "BOUATOURIA",
        "cin": "",
        "ville": "Tunis",
        "telephone": "92230229",
        "email": "",
        "adresse": ""
      }
    },
    "registrationFeeTND": 0,
    "commercialName": "Hanen Gharbi",
    "updatedAt": "2026-09-11T08:03:19.838Z",
    "agency": "Chery Agence Ain Zaghouen",
    "depositPaidTND": 8890,
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-1001",
    "vehicles": [
      {
        "id": "veh-RES-2026-1001-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Exclusive Blue WE)",
        "colorChosen": {
          "id": "col-RES-2026-1001",
          "name": "Exclusive Blue WE",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "documents": [],
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-1001)",
    "carName": "Chery Tiggo 7 PHEV (Exclusive Blue WE)",
    "status": "En attente"
  },
  {
    "notes": "",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "telephone": "29955126",
        "cin": "09995176",
        "ville": "Tunis",
        "adresse": "",
        "nom": "BOUYAHI",
        "email": "",
        "prenom": "ABDELRAOUF"
      }
    },
    "updatedAt": "2026-09-10T16:15:45.528Z",
    "etaDate": "2026-09-10",
    "paymentMethod": "Virement Bancaire",
    "documents": [
      {
        "uploadedAt": "2026-09-10 16:14",
        "dataUrl": "",
        "fileType": "image/jpeg",
        "name": "17890568626774444963516278450351.jpg",
        "category": "cin_recto",
        "sizeFormatted": "3.46 MB",
        "id": "doc-1789056874292-4euv"
      },
      {
        "category": "cin_verso",
        "name": "17890568790031283035740299588081.jpg",
        "id": "doc-1789056886680-9sla",
        "sizeFormatted": "2.83 MB",
        "fileType": "image/jpeg",
        "dataUrl": "",
        "uploadedAt": "2026-09-10 16:14"
      },
      {
        "uploadedAt": "2026-09-10 16:15",
        "category": "quittance_acompte",
        "name": "17890569060855412234537996396799.jpg",
        "fileType": "image/jpeg",
        "id": "doc-1789056924992-01pb",
        "sizeFormatted": "2.83 MB",
        "dataUrl": ""
      }
    ],
    "commercialName": "Marwa Frikha",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "carName": "Chery I03 4X4",
        "unitPriceTND": 84900,
        "totalPriceTND": 84900,
        "quantity": 1,
        "carId": "car-1785753208837",
        "id": "v-1789056748005",
        "requiredDepositTND": 20000,
        "colorChosen": {
          "name": "Gray GY",
          "id": "col-1786454499484",
          "hexCode": "#626a68"
        }
      }
    ],
    "createdAt": "2026-09-10T16:15:45.528Z",
    "expectedDeliveryDate": "2026-10-10",
    "agency": "Siege STA",
    "id": "RES-2026-999",
    "commercialId": "comm-marwa",
    "priceTND": 84900,
    "colorChosen": {
      "name": "Gray GY",
      "hexCode": "#626a68",
      "id": "col-1786454499484"
    },
    "depositPaidTND": 20000,
    "carName": "Chery I03 4X4",
    "carId": "car-1785753208837",
    "status": "En attente"
  },
  {
    "carName": "Chery Tiggo 7 PHEV",
    "priceTND": 88900,
    "commercialName": "TAGOURTI CHERY Sousse",
    "colorChosen": {
      "name": "White BW",
      "interiorColor": "Cuir Noir",
      "stock": 20,
      "id": "col-1-1785753278797",
      "hexCode": "#FFFFFF",
      "reserved": 5
    },
    "status": "Confirmée",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-998)",
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery Agence Sousse",
    "createdAt": "2026-09-10T16:02:42.866Z",
    "registrationFeeTND": 0,
    "updatedAt": "2026-09-10T16:02:42.866Z",
    "commercialId": "user-1787557462429",
    "client": {
      "personnePhysique": {
        "nom": "KHALIL GHANOUCHI",
        "cin": "",
        "ville": "Sousse",
        "prenom": "",
        "email": "",
        "adresse": "",
        "telephone": "98632449"
      },
      "type": "personne_physique"
    },
    "carId": "car-1785753278797",
    "documents": [],
    "id": "RES-2026-1028",
    "vehicles": [
      {
        "unitPriceTND": 88900,
        "quantity": 1,
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "hexCode": "#FFFFFF",
          "name": "White BW",
          "stock": 20,
          "id": "col-1-1785753278797",
          "interiorColor": "Cuir Noir",
          "reserved": 5
        },
        "totalPriceTND": 88900,
        "id": "veh-RES-2026-1028-0",
        "carId": "car-1785753278797"
      }
    ],
    "depositPaidTND": 30000
  },
  {
    "createdAt": "2026-09-10T14:18:19.924Z",
    "notes": "Bon restauré depuis la traçabilité STA (Audit initial #RES-2026-999)",
    "vehicles": [
      {
        "carId": "car-1785753066750",
        "colorChosen": {
          "interiorColor": "Cuir Noir",
          "name": "Gray GV",
          "reserved": 4,
          "hexCode": "#6E6F72",
          "stock": 4,
          "id": "col-3-1785753066750"
        },
        "id": "veh-RES-2026-1005-0",
        "carName": "Chery Tiggo 4 HEV",
        "quantity": 1,
        "totalPriceTND": 79900,
        "unitPriceTND": 79900
      }
    ],
    "paymentMethod": "Chèque Certifié",
    "status": "En attente",
    "commercialId": "comm-marwa",
    "carName": "Chery Tiggo 4 HEV",
    "depositPaidTND": 20000,
    "documents": [],
    "updatedAt": "2026-09-10T14:18:19.924Z",
    "agency": "Siege STA",
    "id": "RES-2026-1005",
    "registrationFeeTND": 0,
    "colorChosen": {
      "name": "Gray GV",
      "reserved": 4,
      "stock": 4,
      "interiorColor": "Cuir Noir",
      "hexCode": "#6E6F72",
      "id": "col-3-1785753066750"
    },
    "priceTND": 79900,
    "commercialName": "Marwa Frikha",
    "carId": "car-1785753066750",
    "client": {
      "personnePhysique": {
        "prenom": "",
        "nom": "Chiraz  Ouji",
        "email": "",
        "ville": "Tunis",
        "cin": "",
        "telephone": "28854702",
        "adresse": ""
      },
      "type": "personne_physique"
    }
  },
  {
    "agency": "Chery siege",
    "registrationFeeTND": 0,
    "carName": "Chery Tiggo 4 HEV",
    "depositPaidTND": 20000,
    "carId": "car-1785753066750",
    "colorChosen": {
      "id": "col-3-1785753066750",
      "stock": 4,
      "reserved": 4,
      "interiorColor": "Cuir Noir",
      "name": "Gray GV",
      "hexCode": "#6E6F72"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-1006-0",
        "quantity": 1,
        "unitPriceTND": 79900,
        "colorChosen": {
          "interiorColor": "Cuir Noir",
          "stock": 4,
          "reserved": 4,
          "name": "Gray GV",
          "hexCode": "#6E6F72",
          "id": "col-3-1785753066750"
        },
        "totalPriceTND": 79900,
        "carName": "Chery Tiggo 4 HEV",
        "carId": "car-1785753066750"
      }
    ],
    "status": "En attente",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "adresse": "",
        "telephone": "25055055",
        "ville": "Tunis",
        "cin": "",
        "email": "",
        "prenom": "",
        "nom": "AMIR ATIG BAHAR"
      }
    },
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-10T14:14:30.474Z",
    "commercialId": "user-1787821380306",
    "commercialName": "Racha Jebeniani",
    "priceTND": 79900,
    "notes": "Bon restauré depuis la traçabilité STA (Audit initial #RES-2026-998)",
    "documents": [],
    "id": "RES-2026-1006",
    "updatedAt": "2026-09-10T14:14:30.474Z"
  },
  {
    "colorChosen": {
      "interiorColor": "Cuir Noir",
      "reserved": 4,
      "stock": 4,
      "name": "Gray GV",
      "id": "col-3-1785753066750",
      "hexCode": "#6E6F72"
    },
    "commercialId": "comm-moez",
    "vehicles": [
      {
        "carName": "Chery Tiggo 4 HEV",
        "id": "veh-RES-2026-1027-0",
        "carId": "car-1785753066750",
        "quantity": 1,
        "unitPriceTND": 79900,
        "colorChosen": {
          "id": "col-3-1785753066750",
          "interiorColor": "Cuir Noir",
          "hexCode": "#6E6F72",
          "reserved": 4,
          "stock": 4,
          "name": "Gray GV"
        },
        "totalPriceTND": 79900
      }
    ],
    "createdAt": "2026-09-10T13:30:52.142Z",
    "client": {
      "personnePhysique": {
        "telephone": "98543954",
        "prenom": "",
        "ville": "Tunis",
        "nom": "ASMA MEJRI",
        "cin": "",
        "adresse": "",
        "email": ""
      },
      "type": "personne_physique"
    },
    "depositPaidTND": 0,
    "registrationFeeTND": 0,
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-1000)",
    "id": "RES-2026-1027",
    "carName": "Chery Tiggo 4 HEV",
    "status": "Confirmée",
    "documents": [],
    "commercialName": "Moez Ben Naser",
    "carId": "car-1785753066750",
    "priceTND": 79900,
    "agency": "Siege STA",
    "paymentMethod": "Chèque Certifié",
    "updatedAt": "2026-09-10T13:30:52.142Z"
  },
  {
    "createdAt": "2026-09-10T13:14:38.728Z",
    "priceTND": 88900,
    "agency": "Chery Agence Sfax",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-997)",
    "id": "RES-2026-997",
    "depositPaidTND": 8890,
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-997",
      "name": "Exclusive Blue WE",
      "hexCode": "#727783"
    },
    "registrationFeeTND": 0,
    "paymentMethod": "Chèque Certifié",
    "documents": [],
    "commercialId": "user-1787557241636",
    "commercialName": "DISTRICARS Sfax",
    "carName": "Chery Tiggo 7 PHEV (Exclusive Blue WE)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "KAMMOUN EP SIALA",
        "prenom": "FATMA",
        "cin": "",
        "ville": "Sfax",
        "telephone": "54198000",
        "email": "",
        "adresse": ""
      }
    },
    "carId": "car-1785753278797",
    "updatedAt": "2026-09-10T13:14:38.728Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-997-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Exclusive Blue WE)",
        "colorChosen": {
          "id": "col-RES-2026-997",
          "name": "Exclusive Blue WE",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "etaDate": "2026-09-10",
    "expectedDeliveryDate": "2026-10-10"
  },
  {
    "depositPaidTND": 30000,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "email": "",
        "prenom": "",
        "ville": "Tunis",
        "nom": "Hichem Ben Amor",
        "telephone": "58213333",
        "adresse": "",
        "cin": ""
      }
    },
    "registrationFeeTND": 0,
    "colorChosen": {
      "reserved": 10,
      "hexCode": "#727783",
      "stock": 15,
      "id": "col-3-1785753278797",
      "interiorColor": "Cuir Noir",
      "name": "Tech Gray GX"
    },
    "vehicles": [
      {
        "carName": "Chery Tiggo 7 PHEV",
        "carId": "car-1785753278797",
        "colorChosen": {
          "name": "Tech Gray GX",
          "hexCode": "#727783",
          "reserved": 10,
          "stock": 15,
          "id": "col-3-1785753278797",
          "interiorColor": "Cuir Noir"
        },
        "id": "veh-RES-2026-1007-0",
        "totalPriceTND": 88900,
        "quantity": 1,
        "unitPriceTND": 88900
      }
    ],
    "notes": "Bon restauré depuis la traçabilité STA (Audit initial #RES-2026-998)",
    "commercialId": "user-1787557525876",
    "carName": "Chery Tiggo 7 PHEV",
    "id": "RES-2026-1007",
    "agency": "Chery Agence Charguia 1",
    "carId": "car-1785753278797",
    "documents": [],
    "updatedAt": "2026-09-10T11:22:01.077Z",
    "status": "Confirmée",
    "priceTND": 88900,
    "createdAt": "2026-09-10T11:22:01.077Z",
    "paymentMethod": "Chèque Certifié",
    "commercialName": "K2EM CHERY Charguia 1"
  },
  {
    "commercialName": "K2EM CHERY Charguia 1",
    "vehicles": [
      {
        "carName": "Chery Himla 4X4 BVA",
        "colorChosen": {
          "hexCode": "#0A0A0A",
          "reserved": 2,
          "name": "Black CH",
          "interiorColor": "Cuir Marron",
          "id": "col-3-1787908920743",
          "stock": 15
        },
        "carId": "car-1787908920743",
        "totalPriceTND": 119900,
        "unitPriceTND": 119900,
        "id": "veh-RES-2026-1008-0",
        "quantity": 1
      }
    ],
    "carName": "Chery Himla 4X4 BVA",
    "carId": "car-1787908920743",
    "client": {
      "societe": {
        "matriculeFiscale": "",
        "email": "",
        "telephone": "20009200",
        "adresse": "",
        "ville": "Tunis",
        "raisonSociale": "Sté MBS"
      },
      "type": "societe"
    },
    "createdAt": "2026-09-10T10:48:15.326Z",
    "paymentMethod": "Chèque Certifié",
    "updatedAt": "2026-09-10T10:48:15.326Z",
    "commercialId": "user-1787557525876",
    "agency": "Chery Agence Charguia 1",
    "notes": "Bon restauré depuis la traçabilité STA (Audit initial #RES-2026-997)",
    "registrationFeeTND": 0,
    "colorChosen": {
      "name": "Black CH",
      "stock": 15,
      "hexCode": "#0A0A0A",
      "interiorColor": "Cuir Marron",
      "id": "col-3-1787908920743",
      "reserved": 2
    },
    "documents": [],
    "status": "Confirmée",
    "priceTND": 119900,
    "id": "RES-2026-1008",
    "depositPaidTND": 11990
  },
  {
    "createdAt": "2026-09-10T10:40:12.509Z",
    "commercialId": "user-1787557525876",
    "registrationFeeTND": 0,
    "id": "RES-2026-996",
    "vehicles": [
      {
        "id": "veh-RES-2026-996-0",
        "carId": "car-1787908920743",
        "carName": "Chery Himla 4X4 BVA (Black CH)",
        "colorChosen": {
          "id": "col-RES-2026-996",
          "name": "Black CH",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 119900,
        "totalPriceTND": 119900
      }
    ],
    "paymentMethod": "Chèque Certifié",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-996)",
    "commercialName": "K2EM CHERY Charguia 1",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Garderie Louis Braille",
        "prenom": "Sté",
        "cin": "",
        "ville": "Tunis",
        "telephone": "28325945",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "agency": "Chery Agence Charguia 1",
    "depositPaidTND": 11990,
    "carName": "Chery Himla 4X4 BVA (Black CH)",
    "etaDate": "2026-09-10",
    "carId": "car-1787908920743",
    "priceTND": 119900,
    "colorChosen": {
      "id": "col-RES-2026-996",
      "name": "Black CH",
      "hexCode": "#727783"
    },
    "updatedAt": "2026-09-10T10:40:12.509Z",
    "status": "Confirmée",
    "expectedDeliveryDate": "2026-10-10"
  },
  {
    "carId": "car-1785753278797",
    "registrationFeeTND": 0,
    "priceTND": 88900,
    "status": "Confirmée",
    "createdAt": "2026-09-10T10:15:06.715Z",
    "agency": "Chery siege",
    "commercialName": "Racha Jebeniani",
    "colorChosen": {
      "name": "Black CL",
      "reserved": 2,
      "interiorColor": "Cuir Noir",
      "stock": 28,
      "id": "col-1786454139529",
      "hexCode": "#050505"
    },
    "id": "RES-2026-1009",
    "updatedAt": "2026-09-10T10:15:06.715Z",
    "depositPaidTND": 8890,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "prenom": "",
        "cin": "",
        "ville": "Tunis",
        "email": "",
        "nom": "OKBA BOUGHANMI",
        "adresse": "",
        "telephone": "55818971"
      }
    },
    "commercialId": "user-1787821380306",
    "vehicles": [
      {
        "unitPriceTND": 88900,
        "carId": "car-1785753278797",
        "id": "veh-RES-2026-1009-0",
        "quantity": 1,
        "totalPriceTND": 88900,
        "colorChosen": {
          "hexCode": "#050505",
          "id": "col-1786454139529",
          "interiorColor": "Cuir Noir",
          "reserved": 2,
          "name": "Black CL",
          "stock": 28
        },
        "carName": "Chery Tiggo 7 PHEV"
      }
    ],
    "carName": "Chery Tiggo 7 PHEV",
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "notes": "Bon restauré depuis la traçabilité STA (Audit initial #RES-2026-995)"
  },
  {
    "vehicles": [
      {
        "unitPriceTND": 88900,
        "id": "veh-RES-2026-1081-0",
        "quantity": 1,
        "totalPriceTND": 88900,
        "colorChosen": {
          "reserved": 4,
          "name": "Black CL",
          "stock": 26,
          "interiorColor": "Cuir Noir",
          "hexCode": "#050505",
          "id": "col-1786454139529"
        },
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV (Black CL)"
      }
    ],
    "documents": [],
    "updatedAt": "2026-09-10T10:15:06.715Z",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-995)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "adresse": "",
        "email": "",
        "ville": "Tunis",
        "prenom": "",
        "nom": "OKBA BOUGHANMI",
        "telephone": "55818971",
        "cin": ""
      }
    },
    "commercialName": "Racha Jebeniani",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-10T10:15:06.715Z",
    "colorChosen": {
      "name": "Black CL",
      "interiorColor": "Cuir Noir",
      "id": "col-1786454139529",
      "reserved": 4,
      "stock": 26,
      "hexCode": "#050505"
    },
    "agency": "Chery siege",
    "depositPaidTND": 30000,
    "id": "RES-2026-1081",
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV (Black CL)",
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "priceTND": 88900,
    "commercialId": "user-1787821380306"
  },
  {
    "commercialId": "user-1787557525876",
    "createdAt": "2026-09-10T10:12:49.500Z",
    "id": "RES-2026-994",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "PA & PI",
        "prenom": "Sté",
        "cin": "",
        "ville": "Tunis",
        "telephone": "20742155",
        "email": "",
        "adresse": ""
      }
    },
    "carId": "car-1785514106502",
    "commercialName": "K2EM CHERY Charguia 1",
    "carName": "Chery Himla 4X4 BVM (Black CH)",
    "etaDate": "2026-09-10",
    "vehicles": [
      {
        "id": "veh-RES-2026-994-0",
        "carId": "car-1785514106502",
        "carName": "Chery Himla 4X4 BVM (Black CH)",
        "colorChosen": {
          "id": "col-RES-2026-994",
          "name": "Black CH",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 102900,
        "totalPriceTND": 102900
      }
    ],
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-994",
      "name": "Black CH",
      "hexCode": "#727783"
    },
    "registrationFeeTND": 0,
    "documents": [],
    "priceTND": 102900,
    "expectedDeliveryDate": "2026-10-10",
    "status": "Confirmée",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-994)",
    "updatedAt": "2026-09-10T10:12:49.500Z",
    "agency": "Chery Agence Charguia 1",
    "depositPaidTND": 10290
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-214)",
    "commercialName": "K2EM CHERY Charguia 1",
    "documents": [],
    "id": "RES-2026-214",
    "agency": "Chery Agence Charguia 1",
    "status": "Confirmée",
    "commercialId": "user-1787557525876",
    "updatedAt": "2026-09-10T10:09:12.989Z",
    "carName": "Chery Himla 4X4 BVM",
    "etaDate": "2026-09-10",
    "paymentMethod": "Chèque Certifié",
    "expectedDeliveryDate": "2026-10-10",
    "createdAt": "2026-09-10T10:09:12.989Z",
    "priceTND": 102900,
    "registrationFeeTND": 0,
    "colorChosen": {
      "id": "col-RES-2026-214",
      "name": "Black CH",
      "hexCode": "#727783"
    },
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Bedis Hchaichi",
        "prenom": "Mohamed",
        "cin": "",
        "ville": "Tunis",
        "telephone": "22552103",
        "email": "",
        "adresse": ""
      }
    },
    "carId": "car-1785514106502",
    "depositPaidTND": 10290,
    "vehicles": [
      {
        "id": "veh-RES-2026-214-0",
        "carId": "car-1785514106502",
        "carName": "Chery Himla 4X4 BVM",
        "colorChosen": {
          "id": "col-RES-2026-214",
          "name": "Black CH",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 102900,
        "totalPriceTND": 102900
      }
    ]
  },
  {
    "colorChosen": {
      "id": "col-RES-2026-993",
      "name": "Gray GV",
      "hexCode": "#6E6F72"
    },
    "commercialId": "user-1787557241636",
    "commercialName": "DISTRICARS Sfax",
    "paymentMethod": "Chèque Certifié",
    "carId": "car-1785753066750",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "TOUMI",
        "prenom": "MAROUA",
        "cin": "",
        "ville": "Sfax",
        "telephone": "28240360",
        "email": "",
        "adresse": ""
      }
    },
    "createdAt": "2026-09-10T09:50:35.549Z",
    "priceTND": 79900,
    "vehicles": [
      {
        "id": "veh-RES-2026-993-0",
        "carId": "car-1785753066750",
        "carName": "Chery Tiggo 4 HEV (Gray GV)",
        "colorChosen": {
          "id": "col-RES-2026-993",
          "name": "Gray GV",
          "hexCode": "#6E6F72"
        },
        "quantity": 1,
        "unitPriceTND": 79900,
        "totalPriceTND": 79900
      }
    ],
    "id": "RES-2026-993",
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "expectedDeliveryDate": "2026-10-10",
    "carName": "Chery Tiggo 4 HEV (Gray GV)",
    "etaDate": "2026-09-10",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-993)",
    "agency": "Chery Agence Sfax",
    "documents": [],
    "depositPaidTND": 7990,
    "updatedAt": "2026-09-10T09:50:35.549Z"
  },
  {
    "colorChosen": {
      "interiorColor": "Cuir Noir",
      "reserved": 1,
      "hexCode": "#FFFFFF",
      "stock": 1,
      "id": "col-1-1785753367152",
      "name": "White BW"
    },
    "registrationFeeTND": 0,
    "documents": [],
    "commercialId": "user-1787821380306",
    "agency": "Chery siege",
    "id": "RES-2026-1010",
    "status": "Confirmée",
    "commercialName": "Racha Jebeniani",
    "updatedAt": "2026-09-10T09:08:25.790Z",
    "carId": "car-1785753367152",
    "priceTND": 102990,
    "notes": "Bon restauré depuis la traçabilité STA (Audit initial #RES-2026-993)",
    "vehicles": [
      {
        "unitPriceTND": 102990,
        "totalPriceTND": 102990,
        "carName": "Chery Tiggo 8 PHEV",
        "colorChosen": {
          "name": "White BW",
          "stock": 1,
          "id": "col-1-1785753367152",
          "hexCode": "#FFFFFF",
          "reserved": 1,
          "interiorColor": "Cuir Noir"
        },
        "id": "veh-RES-2026-1010-0",
        "carId": "car-1785753367152",
        "quantity": 1
      }
    ],
    "depositPaidTND": 40000,
    "createdAt": "2026-09-10T09:08:25.790Z",
    "paymentMethod": "Chèque Certifié",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "prenom": "",
        "cin": "",
        "nom": "RAMI ROMDHANI",
        "telephone": "99353819",
        "ville": "Tunis",
        "email": "",
        "adresse": ""
      }
    },
    "carName": "Chery Tiggo 8 PHEV"
  },
  {
    "agency": "Chery siege",
    "vehicles": [
      {
        "colorChosen": {
          "stock": 5,
          "name": "White BW",
          "interiorColor": "Cuir Noir",
          "id": "col-1-1785753367152",
          "reserved": 0,
          "hexCode": "#FFFFFF"
        },
        "unitPriceTND": 102990,
        "carName": "Chery Tiggo 8 PHEV (White BW)",
        "carId": "car-1785753367152",
        "totalPriceTND": 102990,
        "id": "veh-RES-2026-1041-0",
        "quantity": 1
      }
    ],
    "createdAt": "2026-09-10T09:08:25.790Z",
    "colorChosen": {
      "interiorColor": "Cuir Noir",
      "id": "col-1-1785753367152",
      "hexCode": "#FFFFFF",
      "name": "White BW",
      "reserved": 0,
      "stock": 5
    },
    "depositPaidTND": 40000,
    "registrationFeeTND": 0,
    "carName": "Chery Tiggo 8 PHEV (White BW)",
    "status": "Confirmée",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-993)",
    "carId": "car-1785753367152",
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-1041",
    "commercialName": "Racha Jebeniani",
    "documents": [],
    "commercialId": "user-1787821380306",
    "updatedAt": "2026-09-10T09:08:25.790Z",
    "client": {
      "personnePhysique": {
        "adresse": "",
        "prenom": "",
        "nom": "RAMI ROMDHANI",
        "telephone": "99353819",
        "email": "",
        "cin": "",
        "ville": "Tunis"
      },
      "type": "personne_physique"
    },
    "priceTND": 102990
  },
  {
    "notes": "Bon restauré depuis la traçabilité STA (Audit initial #RES-2026-992)",
    "updatedAt": "2026-09-10T08:59:53.837Z",
    "vehicles": [
      {
        "unitPriceTND": 102990,
        "carName": "Chery Tiggo 8 PHEV (White BW)",
        "totalPriceTND": 102990,
        "colorChosen": {
          "id": "col-1-1785753367152",
          "stock": 1,
          "hexCode": "#FFFFFF",
          "name": "White BW",
          "reserved": 1,
          "interiorColor": "Cuir Noir"
        },
        "id": "veh-RES-2026-1011-0",
        "carId": "car-1785753367152",
        "quantity": 1
      }
    ],
    "depositPaidTND": 40000,
    "client": {
      "personnePhysique": {
        "email": "",
        "ville": "Tunis",
        "prenom": "",
        "cin": "",
        "telephone": "14265273",
        "adresse": "",
        "nom": "RAMI ROMDHANI"
      },
      "type": "personne_physique"
    },
    "documents": [],
    "colorChosen": {
      "name": "White BW",
      "hexCode": "#FFFFFF",
      "reserved": 1,
      "stock": 1,
      "id": "col-1-1785753367152",
      "interiorColor": "Cuir Noir"
    },
    "paymentMethod": "Chèque Certifié",
    "registrationFeeTND": 0,
    "commercialId": "user-1787821380306",
    "id": "RES-2026-1011",
    "carName": "Chery Tiggo 8 PHEV (White BW)",
    "agency": "Chery siege",
    "commercialName": "Racha Jebeniani",
    "status": "Confirmée",
    "priceTND": 102990,
    "carId": "car-1785753367152",
    "createdAt": "2026-09-10T08:59:53.837Z"
  },
  {
    "registrationFeeTND": 0,
    "carId": "car-1785753367152",
    "agency": "Chery siege",
    "vehicles": [
      {
        "carId": "car-1785753367152",
        "colorChosen": {
          "id": "col-1-1785753367152",
          "reserved": 0,
          "hexCode": "#FFFFFF",
          "interiorColor": "Cuir Noir",
          "name": "White BW",
          "stock": 5
        },
        "unitPriceTND": 102990,
        "carName": "Chery Tiggo 8 PHEV (White BW)",
        "quantity": 1,
        "totalPriceTND": 102990,
        "id": "veh-RES-2026-1040-0"
      }
    ],
    "createdAt": "2026-09-10T08:59:53.837Z",
    "id": "RES-2026-1040",
    "carName": "Chery Tiggo 8 PHEV (White BW)",
    "status": "Confirmée",
    "depositPaidTND": 40000,
    "commercialName": "Racha Jebeniani",
    "colorChosen": {
      "name": "White BW",
      "reserved": 0,
      "hexCode": "#FFFFFF",
      "interiorColor": "Cuir Noir",
      "stock": 5,
      "id": "col-1-1785753367152"
    },
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "commercialId": "user-1787821380306",
    "updatedAt": "2026-09-10T08:59:53.837Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "email": "",
        "ville": "Tunis",
        "prenom": "",
        "nom": "RAMI ROMDHANI",
        "telephone": "14265273",
        "adresse": "",
        "cin": ""
      }
    },
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-992)",
    "priceTND": 102990
  },
  {
    "status": "Confirmée",
    "notes": "Bon restauré depuis la traçabilité STA (Audit initial #RES-2026-378)",
    "documents": [],
    "depositPaidTND": 8490,
    "commercialId": "comm-marwa",
    "colorChosen": {
      "stock": 30,
      "name": "Gray GY",
      "hexCode": "#626a68",
      "interiorColor": "Cuir Marron",
      "id": "col-1786454499484",
      "reserved": 0
    },
    "paymentMethod": "Chèque Certifié",
    "updatedAt": "2026-09-09T20:52:48.537Z",
    "priceTND": 84900,
    "id": "RES-2026-1012",
    "agency": "Siege STA",
    "createdAt": "2026-09-09T20:52:48.537Z",
    "vehicles": [
      {
        "unitPriceTND": 84900,
        "quantity": 1,
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "totalPriceTND": 84900,
        "id": "veh-RES-2026-1012-0",
        "colorChosen": {
          "reserved": 0,
          "hexCode": "#626a68",
          "stock": 30,
          "id": "col-1786454499484",
          "interiorColor": "Cuir Marron",
          "name": "Gray GY"
        }
      }
    ],
    "registrationFeeTND": 0,
    "client": {
      "personnePhysique": {
        "prenom": "",
        "telephone": "98609663",
        "nom": "SOUMAYA OUHADA",
        "ville": "Tunis",
        "cin": "",
        "email": "",
        "adresse": ""
      },
      "type": "personne_physique"
    },
    "commercialName": "Marwa Frikha",
    "carName": "Chery I03 4X4",
    "carId": "car-1785753208837"
  },
  {
    "documents": [],
    "depositPaidTND": 20000,
    "commercialId": "comm-marwa",
    "agency": "Siege STA",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-378)",
    "carName": "Chery I03 4X4",
    "colorChosen": {
      "hexCode": "#626a68",
      "id": "col-1786454499484",
      "reserved": 0,
      "interiorColor": "Cuir Marron",
      "stock": 30,
      "name": "Gray GY"
    },
    "updatedAt": "2026-09-09T20:52:48.537Z",
    "status": "Confirmée",
    "priceTND": 84900,
    "createdAt": "2026-09-09T20:52:48.537Z",
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "colorChosen": {
          "name": "Gray GY",
          "interiorColor": "Cuir Marron",
          "reserved": 0,
          "id": "col-1786454499484",
          "hexCode": "#626a68",
          "stock": 30
        },
        "unitPriceTND": 84900,
        "totalPriceTND": 84900,
        "carName": "Chery I03 4X4",
        "id": "veh-RES-2026-1080-0",
        "carId": "car-1785753208837",
        "quantity": 1
      }
    ],
    "id": "RES-2026-1080",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "adresse": "",
        "telephone": "98609663",
        "email": "",
        "ville": "Tunis",
        "nom": "SOUMAYA OUHADA",
        "cin": "",
        "prenom": ""
      }
    },
    "registrationFeeTND": 0,
    "carId": "car-1785753208837",
    "commercialName": "Marwa Frikha"
  },
  {
    "carId": "car-1785753208837",
    "paymentMethod": "Chèque Certifié",
    "etaDate": "2026-11-15",
    "carName": "Chery I03 4X4",
    "createdAt": "2026-09-09T20:52:48.537Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "OUHADA",
        "prenom": "SOUMAYA",
        "cin": "",
        "ville": "Tunis",
        "telephone": "98609663",
        "email": "",
        "adresse": ""
      }
    },
    "commercialId": "comm-marwa",
    "depositPaidTND": 8490,
    "documents": [],
    "registrationFeeTND": 0,
    "commercialName": "Marwa Frikha",
    "id": "RES-2026-378",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-378",
      "name": "Gray GY",
      "hexCode": "#727783"
    },
    "priceTND": 84900,
    "agency": "Siege STA",
    "expectedDeliveryDate": "2026-12-15",
    "updatedAt": "2026-09-09T20:52:48.537Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-378)",
    "vehicles": [
      {
        "id": "veh-RES-2026-378-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-378",
          "name": "Gray GY",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ]
  },
  {
    "paymentMethod": "Chèque Certifié",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE AGRONOMIC SERVICE",
        "matriculeFiscale": "",
        "ville": "Tunis",
        "telephone": "98647659",
        "email": "",
        "adresse": ""
      }
    },
    "depositPaidTND": 12990,
    "documents": [],
    "expectedDeliveryDate": "2026-10-09",
    "carId": "car-1785513071800",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-934)",
    "registrationFeeTND": 0,
    "commercialId": "comm-hanen",
    "agency": "Chery Agence Ain Zaghouen",
    "commercialName": "Hanen Gharbi",
    "id": "RES-2026-934",
    "createdAt": "2026-09-09T17:34:17.507Z",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-934",
      "name": "Huanyu Gray",
      "hexCode": "#727783"
    },
    "carName": "Chery Tiggo 9 PHEV",
    "etaDate": "2026-09-09",
    "priceTND": 129900,
    "vehicles": [
      {
        "id": "veh-RES-2026-934-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-934",
          "name": "Huanyu Gray",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-09T17:34:17.507Z"
  },
  {
    "agency": "Chery Agence Ain Zaghouen",
    "colorChosen": {
      "id": "col-RES-2026-280",
      "name": "Black CM",
      "hexCode": "#727783"
    },
    "documents": [],
    "carId": "car-1785513071800",
    "registrationFeeTND": 0,
    "depositPaidTND": 12990,
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "priceTND": 129900,
    "expectedDeliveryDate": "2026-10-09",
    "createdAt": "2026-09-09T17:29:00.967Z",
    "commercialId": "comm-hanen",
    "carName": "Chery Tiggo 9 PHEV",
    "etaDate": "2026-09-09",
    "commercialName": "Hanen Gharbi",
    "id": "RES-2026-280",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "SAAD CHAIEH MOHAMED",
        "prenom": "BEN",
        "cin": "",
        "ville": "Tunis",
        "telephone": "93653600",
        "email": "",
        "adresse": ""
      }
    },
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-280)",
    "vehicles": [
      {
        "id": "veh-RES-2026-280-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-280",
          "name": "Black CM",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-09T17:29:00.967Z"
  },
  {
    "carName": "Chery Tiggo 9 PHEV",
    "etaDate": "2026-09-09",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-431)",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "ste globale pack",
        "matriculeFiscale": "",
        "ville": "Tunis",
        "telephone": "20201904",
        "email": "",
        "adresse": ""
      }
    },
    "paymentMethod": "Chèque Certifié",
    "commercialId": "comm-hanen",
    "createdAt": "2026-09-09T17:20:29.592Z",
    "expectedDeliveryDate": "2026-10-09",
    "commercialName": "Hanen Gharbi",
    "status": "Confirmée",
    "priceTND": 129900,
    "depositPaidTND": 12990,
    "documents": [],
    "id": "RES-2026-431",
    "carId": "car-1785513071800",
    "registrationFeeTND": 0,
    "agency": "Chery Agence Ain Zaghouen",
    "colorChosen": {
      "id": "col-RES-2026-431",
      "name": "Huanyu Gray",
      "hexCode": "#727783"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-431-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-431",
          "name": "Huanyu Gray",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-09T17:20:29.592Z"
  },
  {
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "2M PARA PHINIX",
        "prenom": "LABORATOIRE",
        "cin": "",
        "ville": "Sfax",
        "telephone": "22 132 286",
        "email": "",
        "adresse": ""
      }
    },
    "depositPaidTND": 10299,
    "id": "RES-2026-697",
    "etaDate": "2026-11-15",
    "carName": "Chery Tiggo 8 PHEV",
    "createdAt": "2026-09-09T16:14:05.621Z",
    "carId": "car-1785753367152",
    "status": "Confirmée",
    "commercialId": "user-1787557241636",
    "paymentMethod": "Chèque Certifié",
    "documents": [],
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-697)",
    "expectedDeliveryDate": "2026-12-15",
    "colorChosen": {
      "id": "col-RES-2026-697",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "priceTND": 102990,
    "commercialName": "DISTRICARS Sfax",
    "agency": "Chery Agence Sfax",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-697-0",
        "carId": "car-1785753367152",
        "carName": "Chery Tiggo 8 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-697",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 102990,
        "totalPriceTND": 102990
      }
    ],
    "updatedAt": "2026-09-09T16:14:05.621Z"
  },
  {
    "id": "RES-2026-825",
    "depositPaidTND": 12990,
    "paymentMethod": "Chèque Certifié",
    "registrationFeeTND": 0,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "MAHDI",
        "prenom": "AYARI",
        "cin": "",
        "ville": "Tunis",
        "telephone": "95867342",
        "email": "",
        "adresse": ""
      }
    },
    "carId": "car-1785513071800",
    "commercialId": "comm-hanen",
    "colorChosen": {
      "id": "col-RES-2026-825",
      "name": "Black CM",
      "hexCode": "#727783"
    },
    "documents": [],
    "priceTND": 129900,
    "expectedDeliveryDate": "2026-12-17",
    "status": "Confirmée",
    "createdAt": "2026-09-09T16:13:33.803Z",
    "etaDate": "2026-11-17",
    "carName": "Chery Tiggo 9 PHEV",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-825)",
    "agency": "Chery Agence Ain Zaghouen",
    "commercialName": "Hanen Gharbi",
    "vehicles": [
      {
        "id": "veh-RES-2026-825-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-825",
          "name": "Black CM",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-09T16:13:33.803Z"
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-513)",
    "priceTND": 129900,
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "etaDate": "2026-09-09",
    "carName": "Chery Tiggo 9 PHEV",
    "agency": "Siege STA",
    "status": "Confirmée",
    "depositPaidTND": 12990,
    "colorChosen": {
      "id": "col-RES-2026-513",
      "name": "Black CM",
      "hexCode": "#727783"
    },
    "id": "RES-2026-513",
    "registrationFeeTND": 0,
    "commercialName": "Marwa Frikha",
    "createdAt": "2026-09-09T16:06:46.388Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "RIDHA  KLOUZ",
        "prenom": "Dr",
        "cin": "",
        "ville": "Tunis",
        "telephone": "28331330",
        "email": "",
        "adresse": ""
      }
    },
    "commercialId": "comm-marwa",
    "expectedDeliveryDate": "2026-10-09",
    "carId": "car-1785513071800",
    "vehicles": [
      {
        "id": "veh-RES-2026-513-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-513",
          "name": "Black CM",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-09T16:06:46.388Z"
  },
  {
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-932",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-932)",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-932-0",
        "carId": "car-1785512735025",
        "carName": "Chery Arrizo 8 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-932",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 89900,
        "totalPriceTND": 89900
      }
    ],
    "id": "RES-2026-932",
    "createdAt": "2026-09-09T15:06:20.825Z",
    "commercialName": "Moez Ben Naser",
    "agency": "Siege STA",
    "updatedAt": "2026-09-09T15:06:20.825Z",
    "depositPaidTND": 8990,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Medss",
        "prenom": "Meddss",
        "cin": "",
        "ville": "Tunis",
        "telephone": "20000000",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 89900,
    "paymentMethod": "Chèque Certifié",
    "carId": "car-1785512735025",
    "documents": [],
    "commercialId": "comm-moez",
    "carName": "Chery Arrizo 8 PHEV"
  },
  {
    "carName": "Chery Tiggo 4 HEV",
    "priceTND": 79900,
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-242",
      "name": "Gray GV",
      "hexCode": "#6E6F72"
    },
    "updatedAt": "2026-09-09T14:58:58.587Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-242)",
    "agency": "Siege STA",
    "documents": [],
    "depositPaidTND": 7990,
    "id": "RES-2026-242",
    "registrationFeeTND": 0,
    "commercialName": "Moez Ben Naser",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Med",
        "prenom": "Medd",
        "cin": "",
        "ville": "Tunis",
        "telephone": "20000000",
        "email": "",
        "adresse": ""
      }
    },
    "carId": "car-1785753066750",
    "paymentMethod": "Chèque Certifié",
    "commercialId": "comm-moez",
    "vehicles": [
      {
        "id": "veh-RES-2026-242-0",
        "carId": "car-1785753066750",
        "carName": "Chery Tiggo 4 HEV",
        "colorChosen": {
          "id": "col-RES-2026-242",
          "name": "Gray GV",
          "hexCode": "#6E6F72"
        },
        "quantity": 1,
        "unitPriceTND": 79900,
        "totalPriceTND": 79900
      }
    ],
    "createdAt": "2026-09-09T14:58:58.587Z"
  },
  {
    "createdAt": "2026-09-09T14:23:56.227Z",
    "commercialId": "comm-hanen",
    "commercialName": "Hanen Gharbi",
    "id": "RES-2026-620",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-620)",
    "colorChosen": {
      "id": "col-RES-2026-620",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "etaDate": "2026-09-09",
    "carName": "Chery Tiggo 9 PHEV",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "bahri  houd",
        "prenom": "el",
        "cin": "",
        "ville": "Tunis",
        "telephone": "25300802",
        "email": "",
        "adresse": ""
      }
    },
    "agency": "Chery Agence Ain Zaghouen",
    "documents": [],
    "priceTND": 129900,
    "carId": "car-1785513071800",
    "expectedDeliveryDate": "2026-10-09",
    "registrationFeeTND": 0,
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 12990,
    "status": "Confirmée",
    "vehicles": [
      {
        "id": "veh-RES-2026-620-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-620",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-09T14:23:56.227Z"
  },
  {
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 8890,
    "priceTND": 88900,
    "carId": "car-1785753278797",
    "documents": [],
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-09-09",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "SEHLI",
        "prenom": "MOHSEN",
        "cin": "",
        "ville": "Tunis",
        "telephone": "21362360",
        "email": "",
        "adresse": ""
      }
    },
    "expectedDeliveryDate": "2026-10-09",
    "registrationFeeTND": 0,
    "agency": "Chery siege",
    "colorChosen": {
      "id": "col-RES-2026-528",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "commercialId": "user-1787821380306",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-528)",
    "createdAt": "2026-09-09T13:25:32.008Z",
    "commercialName": "Racha Jebeniani",
    "status": "Confirmée",
    "id": "RES-2026-528",
    "updatedAt": "2026-09-09T13:25:32.008Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-528-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-528",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ]
  },
  {
    "commercialName": "K2EM CHERY Charguia 1",
    "registrationFeeTND": 0,
    "carId": "car-1785513071800",
    "documents": [],
    "priceTND": 129900,
    "updatedAt": "2026-09-09T13:01:45.643Z",
    "expectedDeliveryDate": "2026-12-15",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "AUDIT AND CORPRATE ADVISOR",
        "prenom": "Sté",
        "cin": "",
        "ville": "Tunis",
        "telephone": "98616661",
        "email": "",
        "adresse": ""
      }
    },
    "agency": "Chery Agence Charguia 1",
    "carName": "Chery Tiggo 9 PHEV",
    "etaDate": "2026-11-15",
    "createdAt": "2026-09-09T13:01:45.643Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-708)",
    "id": "RES-2026-708",
    "depositPaidTND": 12990,
    "commercialId": "user-1787557525876",
    "status": "Confirmée",
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-708",
      "name": "Huanyu Gray",
      "hexCode": "#727783"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-708-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-708",
          "name": "Huanyu Gray",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ]
  },
  {
    "colorChosen": {
      "name": "Black CM",
      "interiorColor": "Cuir Beige & Bleu",
      "hexCode": "#030303",
      "stock": 14,
      "reserved": 3,
      "id": "col-1786981421374"
    },
    "client": {
      "societe": {
        "email": "",
        "telephone": "97392380",
        "matriculeFiscale": "",
        "ville": "Tunis",
        "raisonSociale": "STE MED OIL COMPANY",
        "adresse": ""
      },
      "type": "societe"
    },
    "priceTND": 129900,
    "createdAt": "2026-09-09T11:54:40.046Z",
    "commercialName": "Marwa Frikha",
    "paymentMethod": "Chèque Certifié",
    "notes": "Bon restauré depuis la traçabilité STA (Audit initial #RES-2026-775)",
    "registrationFeeTND": 0,
    "updatedAt": "2026-09-09T11:54:40.046Z",
    "carId": "car-1785513071800",
    "commercialId": "comm-marwa",
    "depositPaidTND": 12990,
    "status": "Confirmée",
    "agency": "Siege STA",
    "id": "RES-2026-1013",
    "vehicles": [
      {
        "carId": "car-1785513071800",
        "unitPriceTND": 129900,
        "quantity": 1,
        "carName": "Chery Tiggo 9 PHEV",
        "id": "veh-RES-2026-1013-0",
        "colorChosen": {
          "reserved": 3,
          "hexCode": "#030303",
          "stock": 14,
          "id": "col-1786981421374",
          "name": "Black CM",
          "interiorColor": "Cuir Beige & Bleu"
        },
        "totalPriceTND": 129900
      }
    ],
    "carName": "Chery Tiggo 9 PHEV",
    "documents": []
  },
  {
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "quantity": 1,
        "totalPriceTND": 129900,
        "id": "veh-RES-2026-1079-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "unitPriceTND": 129900,
        "colorChosen": {
          "interiorColor": "Cuir Beige & Bleu",
          "reserved": 3,
          "id": "col-1786981421374",
          "name": "Black CM",
          "hexCode": "#030303",
          "stock": 14
        }
      }
    ],
    "commercialName": "Marwa Frikha",
    "client": {
      "type": "societe",
      "societe": {
        "matriculeFiscale": "",
        "email": "",
        "raisonSociale": "STE MED OIL COMPANY",
        "ville": "Tunis",
        "adresse": "",
        "telephone": "97392380"
      }
    },
    "colorChosen": {
      "stock": 14,
      "hexCode": "#030303",
      "name": "Black CM",
      "id": "col-1786981421374",
      "reserved": 3,
      "interiorColor": "Cuir Beige & Bleu"
    },
    "registrationFeeTND": 0,
    "carId": "car-1785513071800",
    "createdAt": "2026-09-09T11:54:40.046Z",
    "carName": "Chery Tiggo 9 PHEV",
    "agency": "Siege STA",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-775)",
    "updatedAt": "2026-09-09T11:54:40.046Z",
    "commercialId": "comm-marwa",
    "depositPaidTND": 50000,
    "id": "RES-2026-1079",
    "status": "Confirmée",
    "documents": [],
    "priceTND": 129900
  },
  {
    "documents": [],
    "agency": "Chery Agence Sfax",
    "updatedAt": "2026-09-09T11:19:40.170Z",
    "carId": "car-1785753278797",
    "status": "Confirmée",
    "registrationFeeTND": 0,
    "paymentMethod": "Chèque Certifié",
    "commercialId": "user-1785739349068",
    "carName": "Chery Tiggo 7 PHEV",
    "depositPaidTND": 8890,
    "priceTND": 88900,
    "createdAt": "2026-09-09T11:19:40.170Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-365-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-365",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "commercialName": "Nader Chtourou",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-365)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "HANECHI",
        "prenom": "HOUSSIN",
        "cin": "",
        "ville": "Sfax",
        "telephone": "51770877",
        "email": "",
        "adresse": ""
      }
    },
    "colorChosen": {
      "id": "col-RES-2026-365",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "id": "RES-2026-365"
  },
  {
    "depositPaidTND": 8890,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "ACHOUR EP FEKI",
        "prenom": "NEILA",
        "cin": "",
        "ville": "Sfax",
        "telephone": "58 557 083",
        "email": "",
        "adresse": ""
      }
    },
    "createdAt": "2026-09-09T10:49:59.056Z",
    "carId": "car-1785753278797",
    "commercialId": "user-1787557241636",
    "id": "RES-2026-830",
    "colorChosen": {
      "id": "col-RES-2026-830",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "priceTND": 88900,
    "etaDate": "2026-11-15",
    "carName": "Chery Tiggo 7 PHEV",
    "paymentMethod": "Chèque Certifié",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-830)",
    "agency": "Chery Agence Sfax",
    "expectedDeliveryDate": "2026-12-15",
    "documents": [],
    "status": "Confirmée",
    "commercialName": "DISTRICARS Sfax",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-830-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-830",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-09T10:49:59.056Z"
  },
  {
    "expectedDeliveryDate": "2026-12-15",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Nabouli",
        "prenom": "Jihene",
        "cin": "",
        "ville": "Tunis",
        "telephone": "22279978",
        "email": "",
        "adresse": ""
      }
    },
    "commercialId": "user-1787557525876",
    "updatedAt": "2026-09-09T09:48:30.745Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-551)",
    "colorChosen": {
      "id": "col-RES-2026-551",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "commercialName": "K2EM CHERY Charguia 1",
    "priceTND": 88900,
    "status": "Confirmée",
    "depositPaidTND": 8890,
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-11-15",
    "carId": "car-1785753278797",
    "registrationFeeTND": 0,
    "createdAt": "2026-09-09T09:48:30.745Z",
    "id": "RES-2026-551",
    "agency": "Chery Agence Charguia 1",
    "vehicles": [
      {
        "id": "veh-RES-2026-551-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-551",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ]
  },
  {
    "priceTND": 88900,
    "expectedDeliveryDate": "2026-10-09",
    "commercialId": "comm-marwa",
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 8890,
    "createdAt": "2026-09-09T09:35:15.471Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "SEHLI",
        "prenom": "FAIZA",
        "cin": "",
        "ville": "Tunis",
        "telephone": "98216914",
        "email": "",
        "adresse": ""
      }
    },
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-604)",
    "carId": "car-1785753278797",
    "agency": "Siege STA",
    "id": "RES-2026-604",
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-09-09",
    "commercialName": "Marwa Frikha",
    "registrationFeeTND": 0,
    "documents": [],
    "colorChosen": {
      "id": "col-RES-2026-604",
      "name": "Phantom Gray GV",
      "hexCode": "#727783"
    },
    "status": "Confirmée",
    "vehicles": [
      {
        "id": "veh-RES-2026-604-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-604",
          "name": "Phantom Gray GV",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-09T09:35:15.471Z"
  },
  {
    "carName": "Chery Himla 4X4 BVA",
    "etaDate": "2026-10-15",
    "carId": "car-1787908920743",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-09T09:14:01.055Z",
    "status": "Confirmée",
    "agency": "Chery Agence Sfax",
    "commercialName": "DISTRICARS Sfax",
    "commercialId": "user-1787557241636",
    "depositPaidTND": 11990,
    "expectedDeliveryDate": "2026-11-14",
    "id": "RES-2026-445",
    "documents": [],
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE LANGOUSTE PECHE",
        "matriculeFiscale": "",
        "ville": "Sfax",
        "telephone": "29 060 708",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 119900,
    "registrationFeeTND": 0,
    "colorChosen": {
      "id": "col-RES-2026-445",
      "name": "Black CH",
      "hexCode": "#727783"
    },
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-445)",
    "vehicles": [
      {
        "id": "veh-RES-2026-445-0",
        "carId": "car-1787908920743",
        "carName": "Chery Himla 4X4 BVA",
        "colorChosen": {
          "id": "col-RES-2026-445",
          "name": "Black CH",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 119900,
        "totalPriceTND": 119900
      }
    ],
    "updatedAt": "2026-09-09T09:14:01.055Z"
  },
  {
    "registrationFeeTND": 0,
    "createdAt": "2026-09-09T08:32:42.570Z",
    "commercialName": "Hanen Gharbi",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": " samia",
        "prenom": "jilani",
        "cin": "",
        "ville": "Tunis",
        "telephone": "29955042",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 88900,
    "carId": "car-1785753278797",
    "colorChosen": {
      "id": "col-RES-2026-389",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "commercialId": "comm-hanen",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-389)",
    "documents": [],
    "depositPaidTND": 8890,
    "etaDate": "2026-11-17",
    "carName": "Chery Tiggo 7 PHEV",
    "expectedDeliveryDate": "2026-12-17",
    "agency": "Chery Agence Ain Zaghouen",
    "status": "Confirmée",
    "id": "RES-2026-389",
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "id": "veh-RES-2026-389-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-389",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-09T08:32:42.570Z"
  },
  {
    "updatedAt": "2026-09-09T08:31:07.277Z",
    "priceTND": 88900,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Jouiri",
        "prenom": "Mondher",
        "cin": "",
        "ville": "Tunis",
        "telephone": "29298156",
        "email": "",
        "adresse": ""
      }
    },
    "commercialName": "K2EM CHERY Charguia 1",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-491)",
    "etaDate": "2026-11-15",
    "carName": "Chery Tiggo 7 PHEV",
    "documents": [],
    "id": "RES-2026-491",
    "expectedDeliveryDate": "2026-12-15",
    "commercialId": "user-1787557525876",
    "status": "Confirmée",
    "carId": "car-1785753278797",
    "createdAt": "2026-09-09T08:31:07.277Z",
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery Agence Charguia 1",
    "depositPaidTND": 8890,
    "registrationFeeTND": 0,
    "colorChosen": {
      "id": "col-RES-2026-491",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-491-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-491",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ]
  },
  {
    "agency": "Chery Agence Charguia 1",
    "documents": [],
    "carId": "car-1785753278797",
    "commercialName": "K2EM CHERY Charguia 1",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-474",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "priceTND": 88900,
    "commercialId": "user-1787557525876",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-09T08:18:57.991Z",
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-11-15",
    "registrationFeeTND": 0,
    "expectedDeliveryDate": "2026-12-15",
    "id": "RES-2026-474",
    "depositPaidTND": 8890,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-474)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Ouertateni",
        "prenom": "eya",
        "cin": "",
        "ville": "Tunis",
        "telephone": "99191416",
        "email": "",
        "adresse": ""
      }
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-474-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-474",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-09T08:18:57.991Z"
  },
  {
    "registrationFeeTND": 0,
    "createdAt": "2026-09-09T08:16:15.103Z",
    "carId": "car-1785753278797",
    "commercialId": "user-1787557525876",
    "commercialName": "K2EM CHERY Charguia 1",
    "id": "RES-2026-103",
    "status": "Confirmée",
    "agency": "Chery Agence Charguia 1",
    "vehicles": [
      {
        "unitPriceTND": 88900,
        "carName": "Chery Tiggo 7 PHEV",
        "totalPriceTND": 88900,
        "quantity": 1,
        "colorChosen": {
          "id": "col-1786454139529",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "id": "veh-RES-2026-103-0",
        "carId": "car-1785753278797"
      }
    ],
    "paymentMethod": "Chèque Certifié",
    "documents": [],
    "priceTND": 88900,
    "carName": "Chery Tiggo 7 PHEV",
    "client": {
      "personnePhysique": {
        "ville": "Tunis",
        "cin": "",
        "email": "",
        "adresse": "",
        "prenom": "eya",
        "telephone": "99191416",
        "nom": "Ouertateni"
      },
      "type": "personne_physique"
    },
    "depositPaidTND": 30000,
    "colorChosen": {
      "hexCode": "#050505",
      "id": "col-1786454139529",
      "name": "Black CL"
    },
    "updatedAt": "2026-09-09T08:16:15.103Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-103)"
  },
  {
    "registrationFeeTND": 0,
    "updatedAt": "2026-09-10T13:42:58.855Z",
    "notes": "⏳ Cas n°2 : Accord de leasing joint -> Réservation provisoire créée pour 5 jours ouvrés.",
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-11-15",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Ben Amara",
        "telephone": "93129443",
        "cin": "09800594",
        "prenom": "Nazih",
        "ville": "Tunis",
        "adresse": "",
        "email": ""
      }
    },
    "commercialName": "K2EM CHERY Charguia 1",
    "documents": [
      {
        "dataUrl": "/uploads/1788941061352_Nezih_Ben_Amara.jpeg",
        "sizeFormatted": "0.12 MB",
        "id": "doc-1788941059741-xg5u",
        "uploadedAt": "2026-09-09 08:04",
        "name": "Nezih Ben Amara.jpeg",
        "fileType": "image/jpeg",
        "category": "cin_recto"
      },
      {
        "fileType": "application/pdf",
        "uploadedAt": "2026-09-09 08:05",
        "category": "cin_verso",
        "name": "Nezih Amara2.pdf",
        "sizeFormatted": "0.09 MB",
        "dataUrl": "/uploads/1788941133736_Nezih_Amara2.pdf",
        "id": "doc-1788941132138-bdht"
      },
      {
        "sizeFormatted": "0.17 MB",
        "uploadedAt": "2026-09-09 08:07",
        "name": "Accord Nazih Amara.pdf",
        "id": "doc-1788941226445-hld7",
        "dataUrl": "/uploads/1788941228048_Accord_Nazih_Amara.pdf",
        "fileType": "application/pdf",
        "category": "accord_leasing"
      }
    ],
    "id": "RES-2026-405",
    "colorChosen": {
      "id": "col-3-1785753278797",
      "hexCode": "#727783",
      "name": "Tech Gray GX"
    },
    "agency": "Chery Agence Charguia 1",
    "depositPaidTND": 0,
    "paymentMethod": "Leasing",
    "carId": "car-1785753278797",
    "status": "Confirmée",
    "priceTND": 88900,
    "expectedDeliveryDate": "2026-12-15",
    "commercialId": "user-1787557525876",
    "createdAt": "2026-09-09T08:07:27.723Z"
  },
  {
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery Agence Ain Zaghouen",
    "registrationFeeTND": 0,
    "commercialId": "comm-hanen",
    "createdAt": "2026-09-09T07:47:35.512Z",
    "carId": "car-1785753278797",
    "vehicles": [
      {
        "id": "veh-RES-2026-449-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-449",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "id": "RES-2026-449",
    "colorChosen": {
      "id": "col-RES-2026-449",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "carName": "Chery Tiggo 7 PHEV",
    "status": "Confirmée",
    "commercialName": "Hanen Gharbi",
    "depositPaidTND": 8890,
    "priceTND": 88900,
    "documents": [],
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-449)",
    "updatedAt": "2026-09-09T07:47:35.512Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "BEN REJAB",
        "prenom": "AMIRA",
        "cin": "",
        "ville": "Tunis",
        "telephone": "98270016",
        "email": "",
        "adresse": ""
      }
    }
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-566)",
    "expectedDeliveryDate": "2026-12-15",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE IDROID STORE",
        "matriculeFiscale": "",
        "ville": "Sfax",
        "telephone": "22 787 968",
        "email": "",
        "adresse": ""
      }
    },
    "commercialName": "DISTRICARS Sfax",
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-566",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "priceTND": 84900,
    "createdAt": "2026-09-09T07:46:47.595Z",
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "etaDate": "2026-11-15",
    "carName": "Chery I03 4X4",
    "commercialId": "user-1787557241636",
    "id": "RES-2026-566",
    "depositPaidTND": 8490,
    "carId": "car-1785753208837",
    "documents": [],
    "agency": "Chery Agence Sfax",
    "vehicles": [
      {
        "id": "veh-RES-2026-566-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-566",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-09T07:46:47.595Z"
  },
  {
    "expectedDeliveryDate": "2026-12-15",
    "commercialId": "user-1787557241636",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE IDROID STORE",
        "matriculeFiscale": "",
        "ville": "Sfax",
        "telephone": "22 787 968",
        "email": "",
        "adresse": ""
      }
    },
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-559)",
    "colorChosen": {
      "id": "col-RES-2026-559",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "createdAt": "2026-09-09T07:40:40.018Z",
    "priceTND": 84900,
    "depositPaidTND": 8490,
    "commercialName": "DISTRICARS Sfax",
    "status": "Confirmée",
    "carId": "car-1785753208837",
    "etaDate": "2026-11-15",
    "carName": "Chery I03 4X4",
    "id": "RES-2026-559",
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery Agence Sfax",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-559-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-559",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-09T07:40:40.018Z"
  },
  {
    "createdAt": "2026-09-09T07:38:27.115Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-981)",
    "registrationFeeTND": 0,
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-981",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "priceTND": 88900,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": " BELAID",
        "prenom": "SOUMAYA",
        "cin": "",
        "ville": "Tunis",
        "telephone": "58338876",
        "email": "",
        "adresse": ""
      }
    },
    "expectedDeliveryDate": "2026-10-09",
    "commercialName": "Moez Ben Naser",
    "depositPaidTND": 8890,
    "documents": [],
    "id": "RES-2026-981",
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-09-09",
    "agency": "Siege STA",
    "status": "Confirmée",
    "commercialId": "comm-moez",
    "carId": "car-1785753278797",
    "vehicles": [
      {
        "id": "veh-RES-2026-981-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-981",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-09T07:38:27.115Z"
  },
  {
    "documents": [],
    "status": "Confirmée",
    "id": "RES-2026-281",
    "priceTND": 88900,
    "carId": "car-1785753278797",
    "updatedAt": "2026-09-09T07:31:46.365Z",
    "commercialName": "Hanen Gharbi",
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery Agence Ain Zaghouen",
    "createdAt": "2026-09-09T07:31:46.365Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "salem  najiba",
        "prenom": "ben",
        "cin": "",
        "ville": "Tunis",
        "telephone": "95907783",
        "email": "",
        "adresse": ""
      }
    },
    "colorChosen": {
      "id": "col-RES-2026-281",
      "name": "Phantom Gray GV",
      "hexCode": "#727783"
    },
    "depositPaidTND": 8890,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-281)",
    "commercialId": "comm-hanen",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-281-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-281",
          "name": "Phantom Gray GV",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "carName": "Chery Tiggo 7 PHEV"
  },
  {
    "registrationFeeTND": 0,
    "expectedDeliveryDate": "2026-10-10",
    "agency": "siege STA",
    "documents": [],
    "commercialName": "Bassem Jerbi",
    "paymentMethod": "Chèque Certifié",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-741)",
    "colorChosen": {
      "id": "col-RES-2026-741",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "status": "Confirmée",
    "etaDate": "2026-09-10",
    "carName": "Chery Tiggo 7 PHEV",
    "id": "RES-2026-741",
    "commercialId": "comm-bassem",
    "carId": "car-1785753278797",
    "priceTND": 88900,
    "depositPaidTND": 8890,
    "createdAt": "2026-09-08T16:48:17.299Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "El Zemni",
        "prenom": "Nawel",
        "cin": "",
        "ville": "Tunis",
        "telephone": "00000001",
        "email": "",
        "adresse": ""
      }
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-741-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-741",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-08T16:48:17.299Z"
  },
  {
    "status": "Confirmée",
    "expectedDeliveryDate": "2026-10-10",
    "registrationFeeTND": 0,
    "commercialId": "comm-bassem",
    "carId": "car-1785753278797",
    "createdAt": "2026-09-08T16:43:22.973Z",
    "depositPaidTND": 8890,
    "agency": "siege STA",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "El Zemni",
        "prenom": "Nawel",
        "cin": "",
        "ville": "Tunis",
        "telephone": "00000001",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 88900,
    "id": "RES-2026-647",
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-09-10",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-647)",
    "commercialName": "Bassem Jerbi",
    "documents": [],
    "colorChosen": {
      "id": "col-RES-2026-647",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "id": "veh-RES-2026-647-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-647",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-08T16:43:22.973Z"
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-366)",
    "etaDate": "2026-11-15",
    "carName": "Chery Tiggo 7 PHEV",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "AMINE MAALEJ",
        "prenom": "MOHAMED",
        "cin": "",
        "ville": "Sfax",
        "telephone": "24 496 260",
        "email": "",
        "adresse": ""
      }
    },
    "paymentMethod": "Chèque Certifié",
    "commercialId": "user-1787557241636",
    "createdAt": "2026-09-08T15:18:58.114Z",
    "expectedDeliveryDate": "2026-12-15",
    "commercialName": "DISTRICARS Sfax",
    "status": "Confirmée",
    "priceTND": 88900,
    "depositPaidTND": 8890,
    "documents": [],
    "id": "RES-2026-366",
    "registrationFeeTND": 0,
    "carId": "car-1785753278797",
    "agency": "Chery Agence Sfax",
    "colorChosen": {
      "id": "col-RES-2026-366",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-366-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-366",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-08T15:18:58.114Z"
  },
  {
    "carId": "car-1785514106502",
    "commercialName": "Bassem Jerbi",
    "priceTND": 102900,
    "commercialId": "comm-bassem",
    "createdAt": "2026-09-08T15:03:53.346Z",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "lamine",
        "prenom": "abassi",
        "cin": "",
        "ville": "Tunis",
        "telephone": "22123456",
        "email": "",
        "adresse": ""
      }
    },
    "registrationFeeTND": 0,
    "agency": "siege STA",
    "depositPaidTND": 10290,
    "etaDate": "2026-09-08",
    "carName": "Chery Himla 4X4 BVM",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-983)",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-983",
      "name": "Silver Gray GR",
      "hexCode": "#BFBFBF"
    },
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "expectedDeliveryDate": "2026-10-08",
    "id": "RES-2026-983",
    "vehicles": [
      {
        "id": "veh-RES-2026-983-0",
        "carId": "car-1785514106502",
        "carName": "Chery Himla 4X4 BVM",
        "colorChosen": {
          "id": "col-RES-2026-983",
          "name": "Silver Gray GR",
          "hexCode": "#BFBFBF"
        },
        "quantity": 1,
        "unitPriceTND": 102900,
        "totalPriceTND": 102900
      }
    ],
    "updatedAt": "2026-09-08T15:03:53.346Z"
  },
  {
    "commercialId": "user-1787557241636",
    "createdAt": "2026-09-08T13:29:07.762Z",
    "priceTND": 89900,
    "registrationFeeTND": 0,
    "id": "RES-2026-683",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE DE DEVELOPPEMENT ET PRODUCTION AGRICOLE ERRAZEK",
        "matriculeFiscale": "",
        "ville": "Sfax",
        "telephone": "54 074 990",
        "email": "",
        "adresse": ""
      }
    },
    "depositPaidTND": 8990,
    "carName": "Chery Arrizo 8 PHEV",
    "etaDate": "2026-09-08",
    "carId": "car-1785512735025",
    "commercialName": "DISTRICARS Sfax",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-683)",
    "documents": [],
    "agency": "Chery Agence Sfax",
    "status": "Confirmée",
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-683",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "expectedDeliveryDate": "2026-10-08",
    "vehicles": [
      {
        "id": "veh-RES-2026-683-0",
        "carId": "car-1785512735025",
        "carName": "Chery Arrizo 8 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-683",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 89900,
        "totalPriceTND": 89900
      }
    ],
    "updatedAt": "2026-09-08T13:29:07.762Z"
  },
  {
    "commercialName": "Racha Jebeniani",
    "carId": "car-1785513071800",
    "agency": "Chery siege",
    "documents": [
      {
        "dataUrl": "/uploads/1788873328987_cin_mounir.pdf",
        "sizeFormatted": "4.68 MB",
        "id": "doc-1788873387205-4gst",
        "category": "cin_recto",
        "name": "cin mounir.pdf",
        "uploadedAt": "2026-09-08 13:16",
        "fileType": "application/pdf"
      },
      {
        "name": "cin mounir.pdf",
        "category": "cin_verso",
        "uploadedAt": "2026-09-08 13:16",
        "id": "doc-1788873391616-guhb",
        "fileType": "application/pdf",
        "sizeFormatted": "4.68 MB",
        "dataUrl": "/uploads/1788873333427_cin_mounir.pdf"
      },
      {
        "uploadedAt": "2026-09-08 13:19",
        "category": "virement_bancaire",
        "id": "doc-1788873554224-gf8g",
        "dataUrl": "/uploads/1788873496008_avance_mounir.pdf",
        "fileType": "application/pdf",
        "name": "avance mounir.pdf",
        "sizeFormatted": "5.26 MB"
      },
      {
        "category": "autre",
        "id": "doc-1788873676181-tmaq",
        "name": "accord.pdf",
        "fileType": "application/pdf",
        "uploadedAt": "2026-09-08 13:21",
        "sizeFormatted": "1.31 MB",
        "dataUrl": "/uploads/1788873617928_accord.pdf"
      }
    ],
    "etaDate": "2026-09-08",
    "carName": "Chery Tiggo 9 PHEV",
    "status": "En attente",
    "priceTND": 129900,
    "commercialId": "user-1787821380306",
    "createdAt": "2026-09-08T13:23:28.686Z",
    "registrationFeeTND": 0,
    "paymentMethod": "Virement Bancaire",
    "colorChosen": {
      "hexCode": "#A1A1A1",
      "name": "Huanyu Gray",
      "id": "col-1786981512703"
    },
    "depositPaidTND": 50000,
    "client": {
      "personnePhysique": {
        "cin": "00777634",
        "telephone": "55350749",
        "ville": "Sfax",
        "nom": "MOUNIR",
        "email": "",
        "adresse": "",
        "prenom": "MARRAKCHI"
      },
      "type": "personne_physique"
    },
    "expectedDeliveryDate": "2026-10-08",
    "notes": "⏳ Cas n°2 : Accord de leasing joint -> Réservation provisoire créée pour 5 jours ouvrés.",
    "id": "RES-2026-688"
  },
  {
    "registrationFeeTND": 0,
    "commercialId": "user-1787557241636",
    "agency": "Chery Agence Sfax",
    "colorChosen": {
      "id": "col-RES-2026-356",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "depositPaidTND": 8990,
    "carId": "car-1785512735025",
    "status": "Confirmée",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-08T13:20:13.427Z",
    "id": "RES-2026-356",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-356)",
    "priceTND": 89900,
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE DE DEVELOPPEMENT ET PRODUCTION AGRICOLE ERRAZEK",
        "matriculeFiscale": "",
        "ville": "Sfax",
        "telephone": "+21655488074",
        "email": "",
        "adresse": ""
      }
    },
    "commercialName": "DISTRICARS Sfax",
    "expectedDeliveryDate": "2026-10-08",
    "etaDate": "2026-09-08",
    "carName": "Chery Arrizo 8 PHEV",
    "documents": [],
    "vehicles": [
      {
        "id": "veh-RES-2026-356-0",
        "carId": "car-1785512735025",
        "carName": "Chery Arrizo 8 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-356",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 89900,
        "totalPriceTND": 89900
      }
    ],
    "updatedAt": "2026-09-08T13:20:13.427Z"
  },
  {
    "paymentMethod": "Leasing",
    "createdAt": "2026-09-08T13:16:44.990Z",
    "colorChosen": {
      "name": "Black CL",
      "id": "col-1786454139529",
      "hexCode": "#050505"
    },
    "id": "RES-2026-468",
    "priceTND": 88900,
    "commercialName": "GODDI CHERY Nabeul",
    "notes": "⏳ Cas n°2 : Accord de leasing joint -> Réservation provisoire créée pour 5 jours ouvrés.",
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-11-15",
    "registrationFeeTND": 0,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "email": "",
        "ville": "Tunis",
        "telephone": "50156649",
        "prenom": "SAIDA",
        "adresse": "",
        "nom": "BEN ISMAIL",
        "cin": "15007057"
      }
    },
    "documents": [
      {
        "uploadedAt": "2026-09-08 13:16",
        "sizeFormatted": "0.19 MB",
        "id": "doc-1788873381210-97o8",
        "fileType": "application/pdf",
        "name": "CIN.pdf",
        "dataUrl": "/uploads/1788873380928_CIN.pdf",
        "category": "cin_recto"
      },
      {
        "id": "doc-1788873392820-9qq6",
        "name": "_Notification d'accord.pdf",
        "category": "accord_leasing",
        "sizeFormatted": "0.27 MB",
        "fileType": "application/pdf",
        "uploadedAt": "2026-09-08 13:16",
        "dataUrl": "/uploads/1788873392700__Notification_d_accord.pdf"
      }
    ],
    "agency": "Chery Agence Nabeul",
    "commercialId": "user-1787557344213",
    "carId": "car-1785753278797",
    "depositPaidTND": 0,
    "expectedDeliveryDate": "2026-12-15",
    "status": "En attente"
  },
  {
    "colorChosen": {
      "id": "col-RES-2026-106",
      "name": "Green SC",
      "hexCode": "#2E4B3D"
    },
    "createdAt": "2026-09-08T13:01:58.040Z",
    "status": "Confirmée",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-106)",
    "registrationFeeTND": 0,
    "priceTND": 119900,
    "commercialId": "comm-bassem",
    "carName": "Chery Himla 4X4 BVA",
    "depositPaidTND": 11990,
    "agency": "siege STA",
    "commercialName": "Bassem Jerbi",
    "documents": [],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Ben Tili",
        "prenom": "Aymen",
        "cin": "",
        "ville": "Tunis",
        "telephone": "+21699578949",
        "email": "",
        "adresse": ""
      }
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-106-0",
        "carId": "car-1787908920743",
        "carName": "Chery Himla 4X4 BVA",
        "colorChosen": {
          "id": "col-RES-2026-106",
          "name": "Green SC",
          "hexCode": "#2E4B3D"
        },
        "quantity": 1,
        "unitPriceTND": 119900,
        "totalPriceTND": 119900
      }
    ],
    "updatedAt": "2026-09-08T13:01:58.040Z",
    "carId": "car-1787908920743",
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-106"
  },
  {
    "id": "RES-2026-167",
    "colorChosen": {
      "id": "col-1-1785753278797",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "carId": "car-1785753278797",
    "priceTND": 88900,
    "client": {
      "personnePhysique": {
        "nom": "BOUKHRIS",
        "cin": "",
        "ville": "Tunis",
        "email": "",
        "telephone": "99180885",
        "adresse": "",
        "prenom": "ZEINEB"
      },
      "type": "personne_physique"
    },
    "commercialId": "user-1787557344213",
    "createdAt": "2026-09-08T13:01:41.232Z",
    "depositPaidTND": 30000,
    "commercialName": "GODDI CHERY Nabeul",
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "documents": [],
    "agency": "Chery Agence Nabeul",
    "carName": "Chery Tiggo 7 PHEV",
    "vehicles": [
      {
        "colorChosen": {
          "id": "col-1-1785753278797",
          "hexCode": "#FFFFFF",
          "name": "White BW"
        },
        "unitPriceTND": 88900,
        "id": "veh-RES-2026-167-0",
        "totalPriceTND": 88900,
        "carName": "Chery Tiggo 7 PHEV",
        "carId": "car-1785753278797",
        "quantity": 1
      }
    ],
    "registrationFeeTND": 0,
    "updatedAt": "2026-09-08T13:01:41.232Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-167)"
  },
  {
    "colorChosen": {
      "id": "col-1-1785753208837",
      "hexCode": "#171717",
      "name": "Black BL"
    },
    "id": "RES-2026-295",
    "carId": "car-1785753208837",
    "paymentMethod": "Leasing",
    "registrationFeeTND": 0,
    "depositPaidTND": 0,
    "carName": "Chery I03 4X4",
    "client": {
      "societe": {
        "email": "",
        "telephone": "58604705",
        "ville": "Tunis",
        "adresse": "",
        "raisonSociale": "SOCIETE TAAMALH ENERGIES RENOUVELABLES",
        "registreCommerce": "",
        "matriculeFiscale": "1916471C"
      },
      "type": "societe"
    },
    "commercialId": "user-1787821380306",
    "commercialName": "Racha Jebeniani",
    "etaDate": "2026-09-08",
    "priceTND": 84900,
    "notes": "⚡ Cas n°1 : Bon de commande leasing joint -> Réservation immédiatement validée.",
    "status": "Confirmée",
    "createdAt": "2026-09-08T12:55:03.038Z",
    "expectedDeliveryDate": "2026-10-08",
    "documents": [
      {
        "uploadedAt": "2026-09-08 12:53",
        "sizeFormatted": "5.92 MB",
        "name": "RNE.pdf",
        "dataUrl": "/uploads/1788871963981_RNE.pdf",
        "fileType": "application/pdf",
        "id": "doc-1788872022189-nszi",
        "category": "registre_commerce"
      },
      {
        "uploadedAt": "2026-09-08 12:54",
        "sizeFormatted": "4.89 MB",
        "category": "bon_commande",
        "fileType": "application/pdf",
        "dataUrl": "/uploads/1788871996937_BON_DE_COMMANDE.pdf",
        "id": "doc-1788872055107-24b0",
        "name": "BON DE COMMANDE.pdf"
      },
      {
        "uploadedAt": "2026-09-08 12:54",
        "sizeFormatted": "5.92 MB",
        "category": "autre",
        "name": "RNE.pdf",
        "id": "doc-1788872099135-yl5r",
        "fileType": "application/pdf",
        "dataUrl": "/uploads/1788872040959_RNE.pdf"
      }
    ],
    "agency": "Chery siege"
  },
  {
    "registrationFeeTND": 0,
    "carName": "Chery Tiggo 9 PHEV",
    "etaDate": "2026-11-15",
    "depositPaidTND": 12990,
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "SOCIETE CICK",
        "matriculeFiscale": "",
        "ville": "Tunis",
        "telephone": "55 265 666",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 129900,
    "documents": [],
    "id": "RES-2026-676",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-676)",
    "carId": "car-1785513071800",
    "colorChosen": {
      "id": "col-RES-2026-676",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "status": "Confirmée",
    "commercialName": "GODDI CHERY Nabeul",
    "agency": "Chery Agence Nabeul",
    "expectedDeliveryDate": "2026-12-15",
    "commercialId": "user-1787557344213",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-08T12:27:54.111Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-676-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-676",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-08T12:27:54.111Z"
  },
  {
    "priceTND": 129900,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "BOUSLEMA",
        "prenom": "YOMNA",
        "cin": "",
        "ville": "Tunis",
        "telephone": "53343208",
        "email": "",
        "adresse": ""
      }
    },
    "expectedDeliveryDate": "2026-10-08",
    "colorChosen": {
      "id": "col-RES-2026-314",
      "name": "Black CM",
      "hexCode": "#727783"
    },
    "paymentMethod": "Chèque Certifié",
    "registrationFeeTND": 0,
    "documents": [],
    "depositPaidTND": 12990,
    "id": "RES-2026-314",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-314)",
    "commercialName": "Racha Jebeniani",
    "carId": "car-1785513071800",
    "etaDate": "2026-09-08",
    "carName": "Chery Tiggo 9 PHEV",
    "commercialId": "user-1787821380306",
    "status": "Confirmée",
    "agency": "Chery siege",
    "createdAt": "2026-09-08T11:56:12.845Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-314-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-314",
          "name": "Black CM",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-08T11:56:12.845Z"
  },
  {
    "client": {
      "personnePhysique": {
        "email": "",
        "telephone": "29955126",
        "adresse": "",
        "nom": "ameur ben abdallah",
        "cin": "",
        "ville": "Tunis",
        "prenom": ""
      },
      "type": "personne_physique"
    },
    "depositPaidTND": 0,
    "documents": [],
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-445)",
    "updatedAt": "2026-09-08T11:27:27.879Z",
    "carName": "Chery Tiggo 4 HEV",
    "registrationFeeTND": 0,
    "priceTND": 79900,
    "createdAt": "2026-09-08T11:27:27.879Z",
    "vehicles": [
      {
        "colorChosen": {
          "id": "col-3-1785753066750",
          "reserved": 4,
          "hexCode": "#6E6F72",
          "stock": 4,
          "name": "Gray GV",
          "interiorColor": "Cuir Noir"
        },
        "quantity": 1,
        "unitPriceTND": 79900,
        "carId": "car-1785753066750",
        "totalPriceTND": 79900,
        "carName": "Chery Tiggo 4 HEV"
      }
    ],
    "status": "Confirmée",
    "paymentMethod": "Chèque Certifié",
    "commercialId": "comm-moez",
    "carId": "car-1785753066750",
    "commercialName": "Moez Ben Naser",
    "agency": "Siege STA",
    "id": "RES-2026-1003",
    "colorChosen": {
      "stock": 4,
      "id": "col-3-1785753066750",
      "interiorColor": "Cuir Noir",
      "hexCode": "#6E6F72",
      "name": "Gray GV",
      "reserved": 4
    }
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-495)",
    "status": "Confirmée",
    "commercialId": "user-1787821380306",
    "colorChosen": {
      "id": "col-RES-2026-495",
      "name": "White BX",
      "hexCode": "#F8FAFC"
    },
    "vehicles": [
      {
        "totalPriceTND": 129900,
        "id": "veh-RES-2026-495-0",
        "carName": "Chery Tiggo 9 PHEV",
        "unitPriceTND": 129900,
        "colorChosen": {
          "name": "White BX",
          "id": "col-RES-2026-495",
          "hexCode": "#F8FAFC"
        },
        "carId": "car-1785513071800",
        "quantity": 1
      }
    ],
    "createdAt": "2026-09-08T10:55:32.835Z",
    "commercialName": "Racha Jebeniani",
    "registrationFeeTND": 0,
    "id": "RES-2026-495",
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery siege",
    "carName": "Chery Tiggo 9 PHEV",
    "client": {
      "personnePhysique": {
        "email": "",
        "ville": "Tunis",
        "adresse": "",
        "nom": "BOUSLEMA",
        "cin": "",
        "telephone": "55343208",
        "prenom": "YOMNA"
      },
      "type": "personne_physique"
    },
    "documents": [],
    "priceTND": 129900,
    "depositPaidTND": 50000,
    "updatedAt": "2026-09-08T10:55:32.835Z",
    "carId": "car-1785513071800"
  },
  {
    "colorChosen": {
      "id": "col-RES-2026-291",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "commercialName": "DISTRICARS Sfax",
    "agency": "Chery Agence Sfax",
    "paymentMethod": "Chèque Certifié",
    "expectedDeliveryDate": "2026-12-15",
    "carId": "car-1785753278797",
    "createdAt": "2026-09-08T10:49:59.609Z",
    "status": "Confirmée",
    "priceTND": 88900,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-291)",
    "registrationFeeTND": 0,
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-11-15",
    "commercialId": "user-1787557241636",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE UNIDET TERRE DE SENTEURS",
        "matriculeFiscale": "",
        "ville": "Sfax",
        "telephone": "29 888 003",
        "email": "",
        "adresse": ""
      }
    },
    "depositPaidTND": 8890,
    "documents": [],
    "id": "RES-2026-291",
    "vehicles": [
      {
        "id": "veh-RES-2026-291-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-291",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-08T10:49:59.609Z"
  },
  {
    "expectedDeliveryDate": "2026-10-08",
    "priceTND": 88900,
    "paymentMethod": "Chèque Certifié",
    "colorChosen": {
      "id": "col-RES-2026-720",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "status": "Confirmée",
    "id": "RES-2026-720",
    "depositPaidTND": 8890,
    "agency": "Chery siege",
    "commercialId": "user-1787821380306",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-720)",
    "documents": [],
    "registrationFeeTND": 0,
    "carId": "car-1785753278797",
    "commercialName": "Racha Jebeniani",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "HEDI BEN LAMINE",
        "prenom": "MOHAMED",
        "cin": "",
        "ville": "Tunis",
        "telephone": "22301253",
        "email": "",
        "adresse": ""
      }
    },
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-09-08",
    "createdAt": "2026-09-08T10:33:23.072Z",
    "updatedAt": "2026-09-08T10:33:23.072Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-720-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-720",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ]
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-481)",
    "commercialId": "user-1787557241636",
    "status": "Confirmée",
    "priceTND": 88900,
    "commercialName": "DISTRICARS Sfax",
    "etaDate": "2026-11-15",
    "carName": "Chery Tiggo 7 PHEV",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-08T10:25:21.587Z",
    "colorChosen": {
      "id": "col-RES-2026-481",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "agency": "Chery Agence Sfax",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE TECHNO PRINT",
        "matriculeFiscale": "",
        "ville": "Sfax",
        "telephone": "99 105 666",
        "email": "",
        "adresse": ""
      }
    },
    "registrationFeeTND": 0,
    "documents": [],
    "expectedDeliveryDate": "2026-12-15",
    "id": "RES-2026-481",
    "depositPaidTND": 8890,
    "carId": "car-1785753278797",
    "vehicles": [
      {
        "id": "veh-RES-2026-481-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-481",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-08T10:25:21.587Z"
  },
  {
    "carId": "car-1785753150277",
    "registrationFeeTND": 0,
    "createdAt": "2026-09-08T08:57:46.249Z",
    "commercialName": "DISTRICARS Sfax",
    "status": "Confirmée",
    "carName": "Chery I03 4X2",
    "etaDate": "2026-11-15",
    "agency": "Chery Agence Sfax",
    "id": "RES-2026-381",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "HSSAIRI",
        "prenom": "ADEL",
        "cin": "",
        "ville": "Sfax",
        "telephone": "58 429 777",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "expectedDeliveryDate": "2026-12-15",
    "depositPaidTND": 7690,
    "colorChosen": {
      "id": "col-RES-2026-381",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "priceTND": 76900,
    "paymentMethod": "Chèque Certifié",
    "commercialId": "user-1787557241636",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-381)",
    "vehicles": [
      {
        "id": "veh-RES-2026-381-0",
        "carId": "car-1785753150277",
        "carName": "Chery I03 4X2",
        "colorChosen": {
          "id": "col-RES-2026-381",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 76900,
        "totalPriceTND": 76900
      }
    ],
    "updatedAt": "2026-09-08T08:57:46.249Z"
  },
  {
    "id": "RES-2026-1002",
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "quantity": 1,
        "carName": "Chery Tiggo 9 PHEV",
        "carId": "car-1785513071800",
        "unitPriceTND": 129900,
        "totalPriceTND": 129900,
        "colorChosen": {
          "id": "col-1786981512703",
          "name": "Huanyu Gray",
          "reserved": 2,
          "stock": 7,
          "hexCode": "#A1A1A1",
          "interiorColor": "Cuir Beige & Bleu"
        }
      }
    ],
    "updatedAt": "2026-09-08T07:45:36.263Z",
    "commercialId": "comm-ines",
    "agency": "Chery Agence Ain Zaghouen",
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-224)",
    "depositPaidTND": 0,
    "status": "Confirmée",
    "registrationFeeTND": 0,
    "documents": [],
    "carName": "Chery Tiggo 9 PHEV",
    "colorChosen": {
      "reserved": 2,
      "name": "Huanyu Gray",
      "interiorColor": "Cuir Beige & Bleu",
      "stock": 7,
      "hexCode": "#A1A1A1",
      "id": "col-1786981512703"
    },
    "commercialName": "Ines Chaari",
    "carId": "car-1785513071800",
    "client": {
      "societe": {
        "telephone": "99432299",
        "matriculeFiscale": "",
        "email": "",
        "raisonSociale": "CRISTALUX LIGHTING DESIGN",
        "ville": "Tunis",
        "adresse": ""
      },
      "type": "societe"
    },
    "createdAt": "2026-09-08T07:45:36.263Z",
    "priceTND": 129900
  },
  {
    "priceTND": 129900,
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-877)",
    "depositPaidTND": 12990,
    "documents": [],
    "commercialId": "comm-bassem",
    "agency": "siege STA",
    "id": "RES-2026-877",
    "paymentMethod": "Chèque Certifié",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Ben Tili",
        "prenom": "Aymen",
        "cin": "",
        "ville": "Tunis",
        "telephone": "+21699578949",
        "email": "",
        "adresse": ""
      }
    },
    "carName": "Chery Tiggo 9 PHEV",
    "etaDate": "2026-09-21",
    "colorChosen": {
      "id": "col-RES-2026-877",
      "name": "Black CM",
      "hexCode": "#727783"
    },
    "commercialName": "Bassem Jerbi",
    "expectedDeliveryDate": "2027-02-18",
    "carId": "car-1785513071800",
    "createdAt": "2026-09-07T20:22:25.103Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-877-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-877",
          "name": "Black CM",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-07T20:22:25.103Z"
  },
  {
    "createdAt": "2026-09-07T16:41:19.894Z",
    "status": "Confirmée",
    "priceTND": 76900,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-641)",
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-641",
    "commercialName": "Marwa Frikha",
    "agency": "Siege STA",
    "expectedDeliveryDate": "2026-10-07",
    "depositPaidTND": 7690,
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE EL MAZRAA",
        "matriculeFiscale": "",
        "ville": "Tunis",
        "telephone": "99922726",
        "email": "",
        "adresse": ""
      }
    },
    "commercialId": "comm-marwa",
    "documents": [],
    "colorChosen": {
      "id": "col-RES-2026-641",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "carId": "car-1785753150277",
    "registrationFeeTND": 0,
    "carName": "Chery I03 4X2",
    "etaDate": "2026-09-07",
    "vehicles": [
      {
        "id": "veh-RES-2026-641-0",
        "carId": "car-1785753150277",
        "carName": "Chery I03 4X2",
        "colorChosen": {
          "id": "col-RES-2026-641",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 76900,
        "totalPriceTND": 76900
      }
    ],
    "updatedAt": "2026-09-07T16:41:19.894Z"
  },
  {
    "documents": [],
    "colorChosen": {
      "id": "col-RES-2026-857",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-09-07",
    "carId": "car-1785753278797",
    "depositPaidTND": 8890,
    "id": "RES-2026-857",
    "commercialId": "user-1787557344213",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "SOCETE TUNINK SARL",
        "matriculeFiscale": "",
        "ville": "Tunis",
        "telephone": "25052505",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 88900,
    "agency": "Chery Agence Nabeul",
    "createdAt": "2026-09-07T16:13:46.989Z",
    "interiorColorChosen": {
      "hexCode": "#0F172A",
      "id": "int-tiggo7-1",
      "name": "Noir Carbone"
    },
    "paymentMethod": "Chèque Certifié",
    "registrationFeeTND": 0,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-857)",
    "expectedDeliveryDate": "2026-10-07",
    "commercialName": "GODDI CHERY Nabeul",
    "status": "Confirmée",
    "vehicles": [
      {
        "id": "veh-RES-2026-857-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-857",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-07T16:13:46.989Z"
  },
  {
    "paymentMethod": "Chèque Certifié",
    "carName": "Chery Tiggo 7 PHEV",
    "etaDate": "2026-09-07",
    "status": "Confirmée",
    "commercialName": "GODDI CHERY Nabeul",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-501)",
    "documents": [],
    "interiorColorChosen": {
      "hexCode": "#0F172A",
      "id": "int-tiggo7-1",
      "name": "Noir Carbone"
    },
    "priceTND": 88900,
    "id": "RES-2026-501",
    "commercialId": "user-1787557344213",
    "registrationFeeTND": 0,
    "agency": "Chery Agence Nabeul",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE TUNINK SARL",
        "matriculeFiscale": "",
        "ville": "Tunis",
        "telephone": "25052505",
        "email": "",
        "adresse": ""
      }
    },
    "createdAt": "2026-09-07T16:07:18.924Z",
    "expectedDeliveryDate": "2026-10-07",
    "carId": "car-1785753278797",
    "colorChosen": {
      "id": "col-RES-2026-501",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "depositPaidTND": 8890,
    "vehicles": [
      {
        "id": "veh-RES-2026-501-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-501",
          "name": "White BW",
          "hexCode": "#FFFFFF"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-07T16:07:18.924Z"
  },
  {
    "carId": "car-1785514106502",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE KAMMOUN DE REALISATION IMMOBILIAIRE KARIM",
        "matriculeFiscale": "",
        "ville": "Sfax",
        "telephone": "54 132 133",
        "email": "",
        "adresse": ""
      }
    },
    "etaDate": "2026-10-15",
    "carName": "Chery Himla 4X4 BVM",
    "depositPaidTND": 10290,
    "registrationFeeTND": 0,
    "priceTND": 102900,
    "expectedDeliveryDate": "2026-11-14",
    "documents": [],
    "colorChosen": {
      "id": "col-RES-2026-582",
      "name": "Silver Gray GR",
      "hexCode": "#BFBFBF"
    },
    "id": "RES-2026-582",
    "commercialName": "DISTRICARS Sfax",
    "commercialId": "user-1787557241636",
    "status": "Confirmée",
    "agency": "Chery Agence Sfax",
    "interiorColorChosen": {
      "hexCode": "#0F172A",
      "name": "Noir Carbone",
      "id": "int-himla4x4-1"
    },
    "createdAt": "2026-09-07T15:24:07.501Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-582)",
    "paymentMethod": "Chèque Certifié",
    "vehicles": [
      {
        "id": "veh-RES-2026-582-0",
        "carId": "car-1785514106502",
        "carName": "Chery Himla 4X4 BVM",
        "colorChosen": {
          "id": "col-RES-2026-582",
          "name": "Silver Gray GR",
          "hexCode": "#BFBFBF"
        },
        "quantity": 1,
        "unitPriceTND": 102900,
        "totalPriceTND": 102900
      }
    ],
    "updatedAt": "2026-09-07T15:24:07.501Z"
  },
  {
    "colorChosen": {
      "id": "col-RES-2026-987",
      "name": "Silver Gray GR",
      "hexCode": "#BFBFBF"
    },
    "depositPaidTND": 11990,
    "createdAt": "2026-09-07T15:14:16.823Z",
    "commercialId": "user-1787557241636",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "SAHLL",
        "prenom": "ANOUAR",
        "cin": "",
        "ville": "Sfax",
        "telephone": "+21652747111",
        "email": "",
        "adresse": ""
      }
    },
    "registrationFeeTND": 0,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-987)",
    "id": "RES-2026-987",
    "etaDate": "2026-10-15",
    "carName": "Chery Himla 4X4 BVA",
    "status": "Confirmée",
    "documents": [],
    "carId": "car-1787908920743",
    "paymentMethod": "Chèque Certifié",
    "commercialName": "DISTRICARS Sfax",
    "priceTND": 119900,
    "agency": "Chery Agence Sfax",
    "expectedDeliveryDate": "2026-11-14",
    "vehicles": [
      {
        "id": "veh-RES-2026-987-0",
        "carId": "car-1787908920743",
        "carName": "Chery Himla 4X4 BVA",
        "colorChosen": {
          "id": "col-RES-2026-987",
          "name": "Silver Gray GR",
          "hexCode": "#BFBFBF"
        },
        "quantity": 1,
        "unitPriceTND": 119900,
        "totalPriceTND": 119900
      }
    ],
    "updatedAt": "2026-09-07T15:14:16.823Z"
  },
  {
    "agency": "Chery Agence Sfax",
    "commercialId": "user-1787557241636",
    "paymentMethod": "Chèque Certifié",
    "expectedDeliveryDate": "2026-11-14",
    "depositPaidTND": 11990,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-490)",
    "status": "Confirmée",
    "priceTND": 119900,
    "createdAt": "2026-09-07T15:09:53.294Z",
    "id": "RES-2026-490",
    "carId": "car-1787908920743",
    "commercialName": "DISTRICARS Sfax",
    "colorChosen": {
      "id": "col-RES-2026-490",
      "name": "Black CH",
      "hexCode": "#727783"
    },
    "etaDate": "2026-10-15",
    "carName": "Chery Himla 4X4 BVA",
    "registrationFeeTND": 0,
    "documents": [],
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE IFC BIO TUNISIA",
        "matriculeFiscale": "",
        "ville": "Sfax",
        "telephone": "21 125 007",
        "email": "",
        "adresse": ""
      }
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-490-0",
        "carId": "car-1787908920743",
        "carName": "Chery Himla 4X4 BVA",
        "colorChosen": {
          "id": "col-RES-2026-490",
          "name": "Black CH",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 119900,
        "totalPriceTND": 119900
      }
    ],
    "updatedAt": "2026-09-07T15:09:53.294Z"
  },
  {
    "priceTND": 119900,
    "colorChosen": {
      "id": "col-RES-2026-849",
      "name": "Silver Gray GR",
      "hexCode": "#BFBFBF"
    },
    "agency": "Chery Agence Sfax",
    "createdAt": "2026-09-07T14:59:04.597Z",
    "carId": "car-1787908920743",
    "status": "Confirmée",
    "id": "RES-2026-849",
    "commercialName": "DISTRICARS Sfax",
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 11990,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-849)",
    "carName": "Chery Himla 4X4 BVA",
    "etaDate": "2026-10-15",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "BOUKTHIR",
        "prenom": "ELFEHEM",
        "cin": "",
        "ville": "Sfax",
        "telephone": "98 973 403",
        "email": "",
        "adresse": ""
      }
    },
    "expectedDeliveryDate": "2026-11-14",
    "documents": [],
    "commercialId": "user-1787557241636",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-849-0",
        "carId": "car-1787908920743",
        "carName": "Chery Himla 4X4 BVA",
        "colorChosen": {
          "id": "col-RES-2026-849",
          "name": "Silver Gray GR",
          "hexCode": "#BFBFBF"
        },
        "quantity": 1,
        "unitPriceTND": 119900,
        "totalPriceTND": 119900
      }
    ],
    "updatedAt": "2026-09-07T14:59:04.597Z"
  },
  {
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "DRISS",
        "prenom": "HABIB",
        "cin": "",
        "ville": "Sfax",
        "telephone": "+21658422845",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 76900,
    "carId": "car-1785753150277",
    "documents": [],
    "commercialName": "DISTRICARS Sfax",
    "interiorColorChosen": {
      "hexCode": "#78350F",
      "id": "int-i03-4x2-1",
      "name": "Cuir Marron Cognac"
    },
    "expectedDeliveryDate": "2026-12-15",
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 7690,
    "status": "Confirmée",
    "etaDate": "2026-11-15",
    "carName": "Chery I03 4X2",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-315)",
    "id": "RES-2026-315",
    "commercialId": "user-1787557241636",
    "createdAt": "2026-09-07T14:32:57.079Z",
    "colorChosen": {
      "id": "col-RES-2026-315",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "agency": "Chery Agence Sfax",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-315-0",
        "carId": "car-1785753150277",
        "carName": "Chery I03 4X2",
        "colorChosen": {
          "id": "col-RES-2026-315",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 76900,
        "totalPriceTND": 76900
      }
    ],
    "updatedAt": "2026-09-07T14:32:57.079Z"
  },
  {
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "DRISS",
        "prenom": "MOHAMED",
        "cin": "",
        "ville": "Sfax",
        "telephone": "58 532 361",
        "email": "",
        "adresse": ""
      }
    },
    "colorChosen": {
      "id": "col-RES-2026-287",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "commercialName": "DISTRICARS Sfax",
    "carName": "Chery I03 4X4",
    "etaDate": "2026-11-15",
    "documents": [],
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-287)",
    "paymentMethod": "Chèque Certifié",
    "priceTND": 84900,
    "id": "RES-2026-287",
    "interiorColorChosen": {
      "name": "Cuir Marron",
      "hexCode": "#78350F",
      "id": "int-i03-4x4-1"
    },
    "commercialId": "user-1787557241636",
    "expectedDeliveryDate": "2026-12-15",
    "status": "Confirmée",
    "createdAt": "2026-09-07T14:18:30.721Z",
    "registrationFeeTND": 0,
    "carId": "car-1785753208837",
    "agency": "Chery Agence Sfax",
    "depositPaidTND": 8490,
    "vehicles": [
      {
        "id": "veh-RES-2026-287-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-287",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-07T14:18:30.721Z"
  },
  {
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "DEVOITURE",
        "prenom": "LOCATION",
        "cin": "",
        "ville": "Tunis",
        "telephone": "71699920",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "commercialName": "Hanen Gharbi",
    "interiorColorChosen": {
      "name": "Beige Nappa & Sable",
      "id": "int-1787043707010-3",
      "hexCode": "#D4B996"
    },
    "priceTND": 129900,
    "registrationFeeTND": 0,
    "carId": "car-1785513071800",
    "expectedDeliveryDate": "2026-10-17",
    "paymentMethod": "Chèque Certifié",
    "createdAt": "2026-09-07T12:43:39.361Z",
    "id": "RES-2026-840",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-840",
      "name": "White BX",
      "hexCode": "#F8FAFC"
    },
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-840)",
    "etaDate": "2026-09-17",
    "carName": "Chery Tiggo 9 PHEV",
    "agency": "Chery Agence Ain Zaghouen",
    "commercialId": "comm-hanen",
    "depositPaidTND": 12990,
    "vehicles": [
      {
        "id": "veh-RES-2026-840-0",
        "carId": "car-1785513071800",
        "carName": "Chery Tiggo 9 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-840",
          "name": "White BX",
          "hexCode": "#F8FAFC"
        },
        "quantity": 1,
        "unitPriceTND": 129900,
        "totalPriceTND": 129900
      }
    ],
    "updatedAt": "2026-09-07T12:43:39.361Z"
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-942)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "ELTAIEF",
        "prenom": "MAHER",
        "cin": "",
        "ville": "Sfax",
        "telephone": "98 569 813",
        "email": "",
        "adresse": ""
      }
    },
    "commercialName": "DISTRICARS Sfax",
    "priceTND": 88900,
    "createdAt": "2026-09-07T07:29:08.713Z",
    "colorChosen": {
      "id": "col-RES-2026-942",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "etaDate": "2026-11-15",
    "carName": "Chery Tiggo 7 PHEV",
    "commercialId": "user-1787557241636",
    "expectedDeliveryDate": "2026-12-15",
    "id": "RES-2026-942",
    "status": "Confirmée",
    "registrationFeeTND": 0,
    "documents": [],
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 8890,
    "interiorColorChosen": {
      "id": "int-tiggo7-1",
      "name": "Noir Carbone",
      "hexCode": "#0F172A"
    },
    "agency": "Chery Agence Sfax",
    "carId": "car-1785753278797",
    "vehicles": [
      {
        "id": "veh-RES-2026-942-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-942",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-07T07:29:08.713Z"
  },
  {
    "agency": "Chery Agence Sousse",
    "createdAt": "2026-09-07T07:19:41.062Z",
    "priceTND": 119900,
    "registrationFeeTND": 0,
    "id": "RES-2026-675",
    "commercialId": "user-1787557462429",
    "depositPaidTND": 11990,
    "paymentMethod": "Chèque Certifié",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-675)",
    "status": "Confirmée",
    "carId": "car-1787908920743",
    "documents": [],
    "carName": "Chery Himla 4X4 BVA",
    "etaDate": "2026-09-07",
    "colorChosen": {
      "id": "col-RES-2026-675",
      "name": "Green SC",
      "hexCode": "#2E4B3D"
    },
    "commercialName": "TAGOURTI CHERY Sousse",
    "expectedDeliveryDate": "2026-10-07",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "LAMJED DALLELI",
        "prenom": "MOHAMED",
        "cin": "",
        "ville": "Sousse",
        "telephone": "+21629363854",
        "email": "",
        "adresse": ""
      }
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-675-0",
        "carId": "car-1787908920743",
        "carName": "Chery Himla 4X4 BVA",
        "colorChosen": {
          "id": "col-RES-2026-675",
          "name": "Green SC",
          "hexCode": "#2E4B3D"
        },
        "quantity": 1,
        "unitPriceTND": 119900,
        "totalPriceTND": 119900
      }
    ],
    "updatedAt": "2026-09-07T07:19:41.062Z"
  },
  {
    "depositPaidTND": 30000,
    "status": "En attente",
    "priceTND": 88900,
    "notes": "",
    "paymentMethod": "Virement Bancaire",
    "createdAt": "2026-09-05T09:50:00.014Z",
    "interiorColorChosen": {
      "hexCode": "#0F172A",
      "id": "int-tiggo7-1",
      "name": "Noir Carbone"
    },
    "colorChosen": {
      "name": "Tech Gray GX",
      "hexCode": "#727783",
      "id": "col-3-1785753278797"
    },
    "commercialId": "user-1787557462429",
    "id": "RES-2026-252",
    "agency": "Chery Agence Sousse",
    "expectedDeliveryDate": "2026-12-15",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "adresse": "STAH JABEUR MONASTIR ",
        "email": "",
        "telephone": "55263755",
        "ville": "Monastir",
        "nom": "HARRABI",
        "cin": "11634729",
        "prenom": "RANIA"
      }
    },
    "registrationFeeTND": 0,
    "documents": [
      {
        "name": "abc6769f-ad0a-4429-9e51-f4707d704097.jpg",
        "fileType": "image/jpeg",
        "id": "doc-1788601552710-hreh",
        "dataUrl": "",
        "category": "cin_recto",
        "uploadedAt": "2026-09-05 09:45",
        "sizeFormatted": "0.16 MB"
      },
      {
        "dataUrl": "",
        "fileType": "image/jpeg",
        "category": "cin_verso",
        "sizeFormatted": "0.13 MB",
        "name": "620659dc-7612-4b5a-8c4e-705c2d108584.jpg",
        "id": "doc-1788601557197-j91e",
        "uploadedAt": "2026-09-05 09:45"
      },
      {
        "sizeFormatted": "0.18 MB",
        "id": "doc-1788601576221-m8wv",
        "category": "cin_verso",
        "name": "503dfa44-41fc-4fff-b0ef-19dd9b2d508d.jpg",
        "uploadedAt": "2026-09-05 09:46",
        "dataUrl": "",
        "fileType": "image/jpeg"
      }
    ],
    "carId": "car-1785753278797",
    "etaDate": "2026-11-15",
    "carName": "Chery Tiggo 7 PHEV",
    "commercialName": "TAGOURTI CHERY Sousse"
  },
  {
    "depositPaidTND": 30000,
    "paymentMethod": "Chèque Certifié",
    "id": "RES-2026-714",
    "colorChosen": {
      "name": "Tech Gray GX",
      "hexCode": "#727783",
      "id": "col-3-1785753278797"
    },
    "client": {
      "personnePhysique": {
        "email": "",
        "ville": "Tunis",
        "telephone": "93129443",
        "adresse": "",
        "cin": "",
        "prenom": "Nazih",
        "nom": "Ben Amara"
      },
      "type": "personne_physique"
    },
    "createdAt": "2026-09-05T09:28:33.716Z",
    "carName": "Chery Tiggo 7 PHEV",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-714)",
    "priceTND": 88900,
    "agency": "Chery Agence Charguia 1",
    "commercialId": "user-1787557525876",
    "carId": "car-1785753278797",
    "vehicles": [
      {
        "unitPriceTND": 88900,
        "colorChosen": {
          "name": "Tech Gray GX",
          "hexCode": "#727783",
          "id": "col-3-1785753278797"
        },
        "carName": "Chery Tiggo 7 PHEV",
        "id": "veh-RES-2026-714-0",
        "carId": "car-1785753278797",
        "quantity": 1,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-05T09:28:33.716Z",
    "registrationFeeTND": 0,
    "commercialName": "K2EM CHERY Charguia 1",
    "status": "Confirmée",
    "documents": []
  },
  {
    "registrationFeeTND": 0,
    "commercialName": "K2EM CHERY Charguia 1",
    "client": {
      "personnePhysique": {
        "adresse": "",
        "cin": "",
        "ville": "Tunis",
        "email": "",
        "telephone": "99191416",
        "nom": "Ouertateni",
        "prenom": "Eya"
      },
      "type": "personne_physique"
    },
    "documents": [],
    "priceTND": 88900,
    "commercialId": "user-1787557525876",
    "paymentMethod": "Chèque Certifié",
    "updatedAt": "2026-09-05T08:58:49.539Z",
    "carName": "Chery Tiggo 7 PHEV",
    "carId": "car-1785753278797",
    "createdAt": "2026-09-05T08:58:49.539Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-345)",
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-1786454139529",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "id": "RES-2026-345",
    "vehicles": [
      {
        "carName": "Chery Tiggo 7 PHEV",
        "quantity": 1,
        "carId": "car-1785753278797",
        "unitPriceTND": 88900,
        "id": "veh-RES-2026-345-0",
        "colorChosen": {
          "id": "col-1786454139529",
          "hexCode": "#050505",
          "name": "Black CL"
        },
        "totalPriceTND": 88900
      }
    ],
    "depositPaidTND": 30000,
    "agency": "Chery Agence Charguia 1"
  },
  {
    "createdAt": "2026-09-05T08:12:14.009Z",
    "agency": "Chery Agence Sfax",
    "carId": "car-1785753066750",
    "status": "Confirmée",
    "carName": "Chery Tiggo 4 HEV",
    "etaDate": "2026-11-15",
    "commercialName": "DISTRICARS Sfax",
    "commercialId": "user-1787557241636",
    "interiorColorChosen": {
      "id": "int-tiggo4-1",
      "name": "Noir Carbone",
      "hexCode": "#0F172A"
    },
    "documents": [],
    "depositPaidTND": 7990,
    "registrationFeeTND": 0,
    "expectedDeliveryDate": "2026-12-15",
    "priceTND": 79900,
    "colorChosen": {
      "id": "col-RES-2026-363",
      "name": "Gray GV",
      "hexCode": "#6E6F72"
    },
    "id": "RES-2026-363",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-363)",
    "paymentMethod": "Chèque Certifié",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "FEKIH EP KERKENI",
        "prenom": "SAMIA",
        "cin": "",
        "ville": "Sfax",
        "telephone": "20 262 424",
        "email": "",
        "adresse": ""
      }
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-363-0",
        "carId": "car-1785753066750",
        "carName": "Chery Tiggo 4 HEV",
        "colorChosen": {
          "id": "col-RES-2026-363",
          "name": "Gray GV",
          "hexCode": "#6E6F72"
        },
        "quantity": 1,
        "unitPriceTND": 79900,
        "totalPriceTND": 79900
      }
    ],
    "updatedAt": "2026-09-05T08:12:14.009Z"
  },
  {
    "agency": "Chery Agence Sfax",
    "carName": "Chery Tiggo 7 PHEV",
    "commercialName": "DISTRICARS Sfax",
    "colorChosen": {
      "id": "col-RES-2026-757",
      "name": "Black CL",
      "hexCode": "#050505"
    },
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-757)",
    "paymentMethod": "Chèque Certifié",
    "status": "Confirmée",
    "createdAt": "2026-09-04T15:05:48.451Z",
    "registrationFeeTND": 0,
    "vehicles": [
      {
        "id": "veh-RES-2026-757-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-757",
          "name": "Black CL",
          "hexCode": "#050505"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "id": "RES-2026-757",
    "priceTND": 88900,
    "carId": "car-1785753278797",
    "updatedAt": "2026-09-04T15:05:48.451Z",
    "commercialId": "user-1787557241636",
    "depositPaidTND": 8890,
    "documents": [],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "BOUKHRIS",
        "prenom": "AREF",
        "cin": "",
        "ville": "Sfax",
        "telephone": "50 507 155",
        "email": "",
        "adresse": ""
      }
    }
  },
  {
    "commercialId": "user-1787557241636",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "SAHLL",
        "prenom": "ANOUAR",
        "cin": "",
        "ville": "Sfax",
        "telephone": "+21652747111",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 119900,
    "createdAt": "2026-09-04T13:32:00.359Z",
    "registrationFeeTND": 0,
    "commercialName": "DISTRICARS Sfax",
    "carId": "car-1787908920743",
    "colorChosen": {
      "id": "col-RES-2026-577",
      "name": "Silver Gray GR",
      "hexCode": "#BFBFBF"
    },
    "documents": [],
    "status": "Confirmée",
    "id": "RES-2026-577",
    "carName": "Chery Himla 4X4 BVA",
    "depositPaidTND": 11990,
    "paymentMethod": "Chèque Certifié",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-577)",
    "updatedAt": "2026-09-04T13:32:00.359Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-577-0",
        "carId": "car-1787908920743",
        "carName": "Chery Himla 4X4 BVA",
        "colorChosen": {
          "id": "col-RES-2026-577",
          "name": "Silver Gray GR",
          "hexCode": "#BFBFBF"
        },
        "quantity": 1,
        "unitPriceTND": 119900,
        "totalPriceTND": 119900
      }
    ],
    "agency": "Chery Agence Sfax"
  },
  {
    "priceTND": 119900,
    "carId": "car-1787908920743",
    "commercialName": "DISTRICARS Sfax",
    "createdAt": "2026-09-04T13:23:25.386Z",
    "id": "RES-2026-928",
    "etaDate": "2026-09-04",
    "carName": "Chery Himla 4X4 BVA",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "SAHLL",
        "prenom": "ANOUAR",
        "cin": "",
        "ville": "Sfax",
        "telephone": "52 747 111",
        "email": "",
        "adresse": ""
      }
    },
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery Agence Sfax",
    "commercialId": "user-1787557241636",
    "expectedDeliveryDate": "2026-10-04",
    "depositPaidTND": 11990,
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-928)",
    "colorChosen": {
      "id": "col-RES-2026-928",
      "name": "Silver Gray GR",
      "hexCode": "#BFBFBF"
    },
    "registrationFeeTND": 0,
    "documents": [],
    "status": "Confirmée",
    "vehicles": [
      {
        "id": "veh-RES-2026-928-0",
        "carId": "car-1787908920743",
        "carName": "Chery Himla 4X4 BVA",
        "colorChosen": {
          "id": "col-RES-2026-928",
          "name": "Silver Gray GR",
          "hexCode": "#BFBFBF"
        },
        "quantity": 1,
        "unitPriceTND": 119900,
        "totalPriceTND": 119900
      }
    ],
    "updatedAt": "2026-09-04T13:23:25.386Z"
  },
  {
    "colorChosen": {
      "id": "col-RES-2026-567",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 8890,
    "agency": "Chery Agence Sfax",
    "createdAt": "2026-09-04T07:47:06.225Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-567)",
    "status": "Confirmée",
    "registrationFeeTND": 0,
    "carName": "Chery Tiggo 7 PHEV",
    "priceTND": 88900,
    "vehicles": [
      {
        "id": "veh-RES-2026-567-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-567",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "id": "RES-2026-567",
    "commercialId": "user-1787557241636",
    "documents": [],
    "carId": "car-1785753278797",
    "commercialName": "DISTRICARS Sfax",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "AMINE BAHRI",
        "prenom": "MOHAMED",
        "cin": "",
        "ville": "Sfax",
        "telephone": "23 472 131",
        "email": "",
        "adresse": ""
      }
    },
    "updatedAt": "2026-09-04T07:47:06.225Z"
  },
  {
    "status": "Confirmée",
    "createdAt": "2026-09-03T14:24:05.382Z",
    "colorChosen": {
      "hexCode": "#0A0A0A",
      "stock": 16,
      "reserved": 2,
      "interiorColor": "Cuir Noir",
      "name": "Black CH",
      "id": "col-1786981947069"
    },
    "id": "RES-2026-575",
    "priceTND": 102900,
    "depositPaidTND": 20000,
    "carId": "car-1785514106502",
    "agency": "Chery siege",
    "commercialName": "Racha Jebeniani",
    "documents": [],
    "notes": "Restauré automatiquement depuis la traçabilité (Audit #RES-2026-575)",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "adresse": "",
        "email": "",
        "ville": "Tunis",
        "prenom": "",
        "cin": "",
        "telephone": "52478772",
        "nom": "DHAOUADI ISSAM"
      }
    },
    "carName": "Chery Himla 4X4 BVM",
    "vehicles": [
      {
        "totalPriceTND": 102900,
        "carId": "car-1785514106502",
        "unitPriceTND": 102900,
        "colorChosen": {
          "id": "col-1786981947069",
          "interiorColor": "Cuir Noir",
          "reserved": 2,
          "stock": 16,
          "hexCode": "#0A0A0A",
          "name": "Black CH"
        },
        "carName": "Chery Himla 4X4 BVM",
        "quantity": 1
      }
    ],
    "commercialId": "user-1787821380306",
    "registrationFeeTND": 0,
    "paymentMethod": "Chèque Certifié",
    "updatedAt": "2026-09-03T14:24:05.382Z"
  },
  {
    "id": "RES-2026-948",
    "agency": "Chery Agence Sfax",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-948)",
    "commercialName": "DISTRICARS Sfax",
    "updatedAt": "2026-09-03T14:18:19.492Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-948-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-948",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "carName": "Chery Tiggo 7 PHEV",
    "status": "Confirmée",
    "documents": [],
    "colorChosen": {
      "id": "col-RES-2026-948",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 8890,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "chaffari",
        "prenom": "ibrahim",
        "cin": "",
        "ville": "Sfax",
        "telephone": "+21623234100",
        "email": "",
        "adresse": ""
      }
    },
    "carId": "car-1785753278797",
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "commercialId": "user-1787557241636",
    "createdAt": "2026-09-03T14:18:19.492Z"
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-269)",
    "status": "Confirmée",
    "carName": "Chery Tiggo 7 PHEV",
    "vehicles": [
      {
        "id": "veh-RES-2026-269-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-269",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "commercialId": "user-1787557241636",
    "commercialName": "DISTRICARS Sfax",
    "agency": "Chery Agence Sfax",
    "createdAt": "2026-09-03T14:13:03.351Z",
    "depositPaidTND": 8890,
    "priceTND": 88900,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "KESSENTINI",
        "prenom": "SAMIA",
        "cin": "",
        "ville": "Sfax",
        "telephone": "+21655488074",
        "email": "",
        "adresse": ""
      }
    },
    "colorChosen": {
      "id": "col-RES-2026-269",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "paymentMethod": "Chèque Certifié",
    "updatedAt": "2026-09-03T14:13:03.351Z",
    "id": "RES-2026-269",
    "documents": [],
    "registrationFeeTND": 0,
    "carId": "car-1785753278797"
  },
  {
    "createdAt": "2026-09-03T14:10:58.524Z",
    "commercialName": "DISTRICARS Sfax",
    "status": "Confirmée",
    "vehicles": [
      {
        "id": "veh-RES-2026-748-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-748",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-748)",
    "paymentMethod": "Chèque Certifié",
    "agency": "Chery Agence Sfax",
    "carName": "Chery Tiggo 7 PHEV",
    "colorChosen": {
      "id": "col-RES-2026-748",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "documents": [],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "KESSENTINI",
        "prenom": "SAMIA",
        "cin": "",
        "ville": "Sfax",
        "telephone": "+2165548855 488 074074",
        "email": "",
        "adresse": ""
      }
    },
    "carId": "car-1785753278797",
    "id": "RES-2026-748",
    "priceTND": 88900,
    "updatedAt": "2026-09-03T14:10:58.524Z",
    "registrationFeeTND": 0,
    "commercialId": "user-1787557241636",
    "depositPaidTND": 8890
  },
  {
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-178)",
    "agency": "Chery Agence Sfax",
    "carName": "Chery I03 4X2",
    "commercialName": "DISTRICARS Sfax",
    "status": "Confirmée",
    "vehicles": [
      {
        "id": "veh-RES-2026-178-0",
        "carId": "car-1785753150277",
        "carName": "Chery I03 4X2",
        "colorChosen": {
          "id": "col-RES-2026-178",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 76900,
        "totalPriceTND": 76900
      }
    ],
    "registrationFeeTND": 0,
    "createdAt": "2026-09-03T14:03:48.365Z",
    "priceTND": 76900,
    "id": "RES-2026-178",
    "updatedAt": "2026-09-03T14:03:48.365Z",
    "colorChosen": {
      "id": "col-RES-2026-178",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "paymentMethod": "Chèque Certifié",
    "depositPaidTND": 7690,
    "commercialId": "user-1787557241636",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "DRISS",
        "prenom": "HABIB",
        "cin": "",
        "ville": "Sfax",
        "telephone": "58 422 845",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "carId": "car-1785753150277"
  },
  {
    "agency": "Chery Agence Sfax",
    "registrationFeeTND": 0,
    "colorChosen": {
      "id": "col-RES-2026-185",
      "name": "Black BL",
      "hexCode": "#171717"
    },
    "etaDate": "2026-09-03",
    "carName": "Chery I03 4X4",
    "id": "RES-2026-185",
    "depositPaidTND": 8490,
    "createdAt": "2026-09-03T13:58:25.634Z",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-185)",
    "status": "Confirmée",
    "paymentMethod": "Chèque Certifié",
    "carId": "car-1785753208837",
    "commercialId": "user-1787557241636",
    "documents": [],
    "commercialName": "DISTRICARS Sfax",
    "priceTND": 84900,
    "interiorColorChosen": {
      "id": "int-i03-4x4-1",
      "hexCode": "#78350F",
      "name": "Cuir Marron"
    },
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "DRISS",
        "prenom": "MOHAMED",
        "cin": "",
        "ville": "Sfax",
        "telephone": "58 422 845",
        "email": "",
        "adresse": ""
      }
    },
    "expectedDeliveryDate": "2026-10-03",
    "vehicles": [
      {
        "id": "veh-RES-2026-185-0",
        "carId": "car-1785753208837",
        "carName": "Chery I03 4X4",
        "colorChosen": {
          "id": "col-RES-2026-185",
          "name": "Black BL",
          "hexCode": "#171717"
        },
        "quantity": 1,
        "unitPriceTND": 84900,
        "totalPriceTND": 84900
      }
    ],
    "updatedAt": "2026-09-03T13:58:25.634Z"
  },
  {
    "id": "RES-2026-132",
    "agency": "Chery Agence Sfax",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-132)",
    "createdAt": "2026-09-03T11:07:39.310Z",
    "status": "Confirmée",
    "vehicles": [
      {
        "id": "veh-RES-2026-132-0",
        "carId": "car-1787824742701",
        "carName": "Chery Himla 4X4",
        "colorChosen": {
          "id": "col-RES-2026-132",
          "name": "Noir Ébène",
          "hexCode": "#0A0A0A"
        },
        "quantity": 1,
        "unitPriceTND": 102900,
        "totalPriceTND": 102900
      }
    ],
    "paymentMethod": "Chèque Certifié",
    "commercialName": "DISTRICARS Sfax",
    "depositPaidTND": 10290,
    "colorChosen": {
      "id": "col-RES-2026-132",
      "name": "Noir Ébène",
      "hexCode": "#0A0A0A"
    },
    "updatedAt": "2026-09-03T11:07:39.310Z",
    "registrationFeeTND": 0,
    "priceTND": 102900,
    "carId": "car-1787824742701",
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE IFC BIO TUNISIA",
        "matriculeFiscale": "",
        "ville": "Sfax",
        "telephone": "21 125 007",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "commercialId": "user-1787557241636",
    "carName": "Chery Himla 4X4"
  },
  {
    "registrationFeeTND": 0,
    "colorChosen": {
      "id": "col-RES-2026-143",
      "name": "Noir Ébène",
      "hexCode": "#0A0A0A"
    },
    "commercialId": "comm-bassem",
    "priceTND": 102900,
    "paymentMethod": "Chèque Certifié",
    "documents": [],
    "client": {
      "type": "societe",
      "societe": {
        "raisonSociale": "STE IFC BIO TUNISIA",
        "matriculeFiscale": "",
        "ville": "Tunis",
        "telephone": "21 125 007",
        "email": "",
        "adresse": ""
      }
    },
    "updatedAt": "2026-09-03T10:51:45.998Z",
    "id": "RES-2026-143",
    "depositPaidTND": 10290,
    "carName": "Chery Himla 4X4",
    "carId": "car-1787824742701",
    "commercialName": "Bassem Jerbi",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-143)",
    "createdAt": "2026-09-03T10:51:45.998Z",
    "agency": "siege STA",
    "status": "Confirmée",
    "vehicles": [
      {
        "id": "veh-RES-2026-143-0",
        "carId": "car-1787824742701",
        "carName": "Chery Himla 4X4",
        "colorChosen": {
          "id": "col-RES-2026-143",
          "name": "Noir Ébène",
          "hexCode": "#0A0A0A"
        },
        "quantity": 1,
        "unitPriceTND": 102900,
        "totalPriceTND": 102900
      }
    ]
  },
  {
    "registrationFeeTND": 0,
    "commercialId": "comm-bassem",
    "depositPaidTND": 8890,
    "agency": "siege STA",
    "status": "Confirmée",
    "createdAt": "2026-09-01T13:58:44.901Z",
    "colorChosen": {
      "id": "col-RES-2026-248",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "carId": "car-1785753278797",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-248)",
    "expectedDeliveryDate": "2026-10-01",
    "etaDate": "2026-09-01",
    "carName": "Chery Tiggo 7 PHEV",
    "interiorColorChosen": {
      "id": "int-tiggo7-1",
      "name": "Noir Carbone",
      "hexCode": "#0F172A"
    },
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "KESSENTINI",
        "prenom": "SAMIA",
        "cin": "",
        "ville": "Tunis",
        "telephone": "55 488 074",
        "email": "",
        "adresse": ""
      }
    },
    "priceTND": 88900,
    "paymentMethod": "Chèque Certifié",
    "documents": [],
    "id": "RES-2026-248",
    "commercialName": "Bassem Jerbi",
    "vehicles": [
      {
        "id": "veh-RES-2026-248-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-248",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-09-01T13:58:44.901Z"
  },
  {
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV",
    "registrationFeeTND": 0,
    "depositPaidTND": 8890,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "KESSENTINI",
        "prenom": "SAMIA",
        "cin": "",
        "ville": "Tunis",
        "telephone": "55 488 074",
        "email": "",
        "adresse": ""
      }
    },
    "documents": [],
    "id": "RES-2026-583",
    "priceTND": 88900,
    "updatedAt": "2026-09-01T13:50:41.396Z",
    "createdAt": "2026-09-01T13:50:41.396Z",
    "vehicles": [
      {
        "id": "veh-RES-2026-583-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-583",
          "name": "Tech Gray GX",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "status": "Confirmée",
    "colorChosen": {
      "id": "col-RES-2026-583",
      "name": "Tech Gray GX",
      "hexCode": "#727783"
    },
    "commercialName": "Bassem Jerbi",
    "agency": "siege STA",
    "paymentMethod": "Chèque Certifié",
    "commercialId": "comm-bassem",
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-583)"
  },
  {
    "commercialName": "GODDI CHERY Nabeul",
    "agency": "Chery Agence Nabeul",
    "paymentMethod": "Chèque Certifié",
    "carId": "car-1785753278797",
    "priceTND": 88900,
    "registrationFeeTND": 0,
    "status": "Confirmée",
    "etaDate": "2026-08-31",
    "carName": "Chery Tiggo 7 PHEV",
    "id": "RES-2026-187",
    "documents": [],
    "interiorColorChosen": {
      "id": "int-tiggo7-1",
      "name": "Noir Carbone",
      "hexCode": "#0F172A"
    },
    "notes": "Bon de réservation reconstruit avec précision depuis la traçabilité STA (Audit #RES-2026-187)",
    "expectedDeliveryDate": "2026-09-30",
    "commercialId": "user-1787557344213",
    "depositPaidTND": 8890,
    "createdAt": "2026-08-31T08:39:26.723Z",
    "colorChosen": {
      "id": "col-RES-2026-187",
      "name": "Phantom Gray GV",
      "hexCode": "#727783"
    },
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "nom": "Nabeul",
        "prenom": "Chery",
        "cin": "",
        "ville": "Tunis",
        "telephone": "0000000000",
        "email": "",
        "adresse": ""
      }
    },
    "vehicles": [
      {
        "id": "veh-RES-2026-187-0",
        "carId": "car-1785753278797",
        "carName": "Chery Tiggo 7 PHEV",
        "colorChosen": {
          "id": "col-RES-2026-187",
          "name": "Phantom Gray GV",
          "hexCode": "#727783"
        },
        "quantity": 1,
        "unitPriceTND": 88900,
        "totalPriceTND": 88900
      }
    ],
    "updatedAt": "2026-08-31T08:39:26.723Z"
  },
  {
    "colorChosen": {
      "name": "Black CL",
      "id": "col-1786454139529",
      "hexCode": "#050505"
    },
    "client": {
      "personnePhysique": {
        "email": "",
        "ville": "Sfax",
        "adresse": "",
        "prenom": "RAOUIA",
        "cin": "08789109",
        "telephone": "26400000",
        "nom": "BOUZID"
      },
      "type": "personne_physique"
    },
    "createdAt": "2026-08-27T09:26:27.723Z",
    "depositPaidTND": 0,
    "id": "RES-2026-347",
    "notes": "⏳ Cas n°2 : Accord de leasing joint -> Réservation provisoire créée pour 5 jours ouvrés.",
    "registrationFeeTND": 0,
    "priceTND": 88900,
    "carId": "car-1785753278797",
    "carName": "Chery Tiggo 7 PHEV",
    "commercialName": "Racha Jebeniani",
    "status": "Confirmée",
    "commercialId": "user-1787821380306",
    "paymentMethod": "Leasing",
    "agency": "Chery siege",
    "documents": [
      {
        "dataUrl": "",
        "id": "doc-1787822754704-85j5",
        "fileType": "image/jpeg",
        "category": "cin_recto",
        "name": "CIN.jpg",
        "sizeFormatted": "2.52 MB",
        "uploadedAt": "2026-08-27 09:25"
      },
      {
        "sizeFormatted": "2.40 MB",
        "dataUrl": "",
        "id": "doc-1787822761811-2aj7",
        "uploadedAt": "2026-08-27 09:26",
        "name": "CIN VERSO.jpg",
        "category": "cin_verso",
        "fileType": "image/jpeg"
      },
      {
        "category": "accord_leasing",
        "fileType": "image/jpeg",
        "uploadedAt": "2026-08-27 09:26",
        "id": "doc-1787822783265-kphs",
        "name": "ACCORD.jpg",
        "sizeFormatted": "2.43 MB",
        "dataUrl": ""
      }
    ],
    "interiorColorChosen": {
      "id": "int-tiggo7-1",
      "hexCode": "#0F172A",
      "name": "Noir Carbone"
    }
  },
  {
    "commercialId": "comm-bassem",
    "agency": "siege STA",
    "paymentMethod": "Chèque Certifié",
    "carId": "car-1785514106502",
    "status": "Confirmée",
    "documents": [
      {
        "id": "doc-1787743862855-0w14",
        "uploadedAt": "2026-08-26 11:31",
        "dataUrl": "",
        "name": "img20260826_12203220.pdf",
        "sizeFormatted": "2.38 MB",
        "category": "bon_commande",
        "fileType": "application/pdf"
      }
    ],
    "commercialName": "Bassem Jerbi",
    "interiorColorChosen": {
      "id": "int-himla4x4-1",
      "hexCode": "#0F172A",
      "name": "Noir Carbone"
    },
    "depositPaidTND": 20000,
    "colorChosen": {
      "id": "col-1-1785514106502",
      "name": "Silver Gray GR",
      "hexCode": "#BFBFBF"
    },
    "notes": "MERCI D'ACCELERER LA CARTE GRISE | ⚡ Cas n°1 : Bon de commande leasing joint -> Réservation immédiatement validée.",
    "priceTND": 102900,
    "registrationFeeTND": 0,
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "telephone": "50 156 314",
        "nom": "JARRAYA",
        "ville": "Sfax",
        "cin": "01091718",
        "email": "jarrayamdomar@gmail.com",
        "adresse": "67 AVENUE D'ALGERIE 3000-SFAX",
        "prenom": "NOUREDDINE"
      }
    },
    "createdAt": "2026-08-26T11:34:37.834Z",
    "carName": "Chery Himla 4X4 BVM",
    "id": "RES-2026-118"
  },
  {
    "notes": "prévoir livraison de borne de recharge a J-10",
    "id": "RES-2026-949",
    "depositPaidTND": 50000,
    "documents": [
      {
        "sizeFormatted": "1.56 MB",
        "dataUrl": "",
        "category": "cin_recto",
        "fileType": "application/pdf",
        "uploadedAt": "2026-08-21 12:22",
        "id": "doc-1787314964328-mssh",
        "name": "invitation china.pdf"
      },
      {
        "uploadedAt": "2026-08-21 12:23",
        "dataUrl": "",
        "name": "BILLET CHINE AVRIL.pdf",
        "sizeFormatted": "0.03 MB",
        "category": "cin_verso",
        "fileType": "application/pdf",
        "id": "doc-1787314984410-xsit"
      },
      {
        "uploadedAt": "2026-08-21 12:23",
        "sizeFormatted": "0.10 MB",
        "category": "quittance_acompte",
        "fileType": "application/pdf",
        "name": "I03 4X2 Fiche Technique.pdf",
        "id": "doc-1787315001946-you7",
        "dataUrl": ""
      },
      {
        "dataUrl": "",
        "sizeFormatted": "0.10 MB",
        "category": "quittance_acompte",
        "fileType": "application/pdf",
        "uploadedAt": "2026-08-21 12:23",
        "id": "doc-1787315017845-uau8",
        "name": "I03 4X2 Fiche Technique.pdf"
      }
    ],
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "adresse": "",
        "nom": "mokhtar",
        "ville": "Gabès",
        "telephone": "22123456",
        "email": "ali.mokhtar@gmail.com",
        "prenom": "ali",
        "cin": "00255075"
      }
    },
    "registrationFeeTND": 0,
    "commercialId": "comm-bassem",
    "priceTND": 129900,
    "colorChosen": {
      "name": "White BX",
      "id": "col-1-1785513071800",
      "hexCode": "#FCFCFC"
    },
    "createdAt": "2026-08-21T12:24:03.907Z",
    "agency": "siege STA",
    "interiorColorChosen": {
      "id": "int-1787043707010-1",
      "hexCode": "#0F172A",
      "name": "Noir Carbone"
    },
    "commercialName": "Bassem Jerbi",
    "status": "En attente",
    "carName": "Chery Tiggo 9 PHEV",
    "carId": "car-1785513071800",
    "paymentMethod": "Virement Bancaire"
  },
  {
    "notes": "⏳ Cas n°2 : Accord de leasing joint -> Réservation provisoire créée pour 5 jours ouvrés.",
    "commercialId": "comm-marwa",
    "etaDate": "2026-08-21",
    "client": {
      "societe": {
        "ville": "Tunis",
        "raisonSociale": "STE AUTONOMOUS ENG",
        "adresse": "",
        "registreCommerce": "147856569",
        "telephone": "25858693",
        "gerantNomPrenom": "SAMI ",
        "email": "",
        "gerantCin": "12365478",
        "matriculeFiscale": "12584689M"
      },
      "type": "societe"
    },
    "registrationFeeTND": 0,
    "createdAt": "2026-08-21T07:54:15.368Z",
    "commercialName": "Marwa Frikha",
    "paymentMethod": "Leasing",
    "documents": [],
    "colorChosen": {
      "id": "col-1-1785753278797",
      "name": "White BW",
      "hexCode": "#FFFFFF"
    },
    "expectedDeliveryDate": "2026-09-20",
    "id": "RES-2026-654",
    "agency": "Siege STA",
    "priceTND": 88900,
    "carName": "Chery Tiggo 7 PHEV",
    "depositPaidTND": 0,
    "status": "Confirmée",
    "carId": "car-1785753278797"
  },
  {
    "depositPaidTND": 50000,
    "documents": [
      {
        "sizeFormatted": "0.80 MB",
        "uploadedAt": "2026-08-20 11:56",
        "name": "RECTIFY_IMG_20260121_094618.jpg",
        "fileType": "image/jpeg",
        "category": "cin_recto",
        "id": "doc-1787226977075-xw2r",
        "dataUrl": ""
      },
      {
        "uploadedAt": "2026-08-20 11:56",
        "name": "RECTIFY_IMG_20260121_094642.jpg",
        "sizeFormatted": "0.66 MB",
        "id": "doc-1787226983246-nk84",
        "category": "cin_verso",
        "fileType": "image/jpeg",
        "dataUrl": ""
      },
      {
        "fileType": "application/pdf",
        "sizeFormatted": "0.03 MB",
        "category": "accord_leasing",
        "id": "doc-1787227020079-pla7",
        "dataUrl": "",
        "name": "med guenichi ACCORD.pdf",
        "uploadedAt": "2026-08-20 11:57"
      }
    ],
    "carId": "car-1785513071800",
    "commercialId": "comm-bassem",
    "priceTND": 129900,
    "client": {
      "personnePhysique": {
        "cin": "09216793",
        "ville": "Tunis",
        "adresse": "SIDI BOUZID",
        "telephone": "22336546",
        "email": "TEST@GMAIL.COM",
        "prenom": "MOHAMED",
        "nom": "GUENICHI"
      },
      "type": "personne_physique"
    },
    "interiorColorChosen": {
      "name": "Noir Carbone",
      "id": "int-1787043707010-1",
      "hexCode": "#0F172A"
    },
    "id": "RES-2026-593",
    "paymentMethod": "Leasing",
    "agency": "siege STA",
    "createdAt": "2026-08-20T11:58:35.867Z",
    "colorChosen": {
      "name": "Green SJ",
      "hexCode": "#087252",
      "id": "col-2-1785513071800"
    },
    "notes": "⏳ Cas n°2 : Accord de leasing joint -> Réservation provisoire créée pour 5 jours ouvrés.",
    "registrationFeeTND": 0,
    "carName": "Chery Tiggo 9 PHEV",
    "status": "En attente",
    "commercialName": "Bassem Jerbi"
  },
  {
    "interiorColorChosen": {
      "hexCode": "#991B1B",
      "name": "Rouge Sport & Noir",
      "id": "int-1787043707010-4"
    },
    "commercialName": "Ines Chaari",
    "client": {
      "type": "personne_physique",
      "personnePhysique": {
        "ville": "Tunis",
        "adresse": "",
        "cin": "00000000",
        "telephone": "+21699578949",
        "prenom": "Aymen",
        "nom": "Bt",
        "email": "aymen.bentili@kilanigroupe.com"
      }
    },
    "notes": "⏳ Cas n°2 : Accord de leasing joint -> Réservation provisoire créée pour 5 jours ouvrés.",
    "paymentMethod": "Leasing",
    "colorChosen": {
      "name": "White BX",
      "id": "col-1-1785513071800",
      "hexCode": "#FCFCFC"
    },
    "createdAt": "2026-08-19T17:48:32.198Z",
    "commercialId": "comm-ines",
    "status": "En attente",
    "carId": "car-1785513071800",
    "registrationFeeTND": 0,
    "carName": "Chery Tiggo 9 PHEV",
    "depositPaidTND": 50000,
    "agency": "Chery Agence Ain Zaghouen",
    "id": "RES-2026-117",
    "documents": [],
    "priceTND": 129900
  }
];
