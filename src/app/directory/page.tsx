'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Search, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { CoursesSidebar } from '@/components/courses-sidebar';
import { Header } from '@/components/header';
import { ScrollArea } from '@/components/ui/scroll-area';

const indianWebsites = [
    { rank: 1, name: '99acres', website: '99acres.com', focus: 'Residential, Commercial, Plots, Rentals (Pan-India)', contact: '1800 41 99000' },
    { rank: 2, name: 'Housing.com', website: 'housing.com', focus: 'Property Listings, Price Trends (Pan-India)', contact: '080 3006 1818' },
    { rank: 3, name: 'MagicBricks', website: 'magicbricks.com', focus: 'Listings, Home Services (Pan-India)', contact: '1800 103 1031' },
    { rank: 4, name: 'NoBroker', website: 'nobroker.in', focus: 'Zero-brokerage platform (Rent/Buy/Sell)', contact: '09241 700 000' },
    { rank: 5, name: 'PropTiger', website: 'proptiger.com', focus: 'Residential Sales, Advisory', contact: '1800 103 1041' },
    { rank: 6, name: 'CommonFloor', website: 'commonfloor.com', focus: 'Listings, Apartment Management', contact: 'Use contact form' },
    { rank: 7, name: 'Makaan.com', website: 'makaan.com', focus: 'Residential & Commercial Listings', contact: 'Use contact form' },
    { rank: 8, name: 'Square Yards', website: 'squareyards.com', focus: 'Residential Broking, Advisory', contact: '1800 208 3344' },
    { rank: 9, name: 'Quikr Homes', website: 'quikr.com/homes', focus: 'Classifieds, Property Listings', contact: 'Use Quikr\'s customer service' },
    { rank: 10, name: 'Indiaproperty', website: 'indiaproperty.com', focus: 'Listings, Focus on South India', contact: 'Use contact form' },
    { rank: 11, name: 'Sulekha Properties', website: 'sulekha.com/property', focus: 'Local Services & Listings', contact: 'Use Sulekha customer care' },
    { rank: 12, name: 'PropertyWala', website: 'propertywala.com', focus: 'Property Listings, Reviews', contact: 'Use contact form' },
    { rank: 13, name: 'RoofandFloor', website: 'roofandfloor.com', focus: 'Listings, focus on new projects', contact: 'Use contact form' },
    { rank: 14, name: 'NestAway', website: 'nestaway.com', focus: 'Fully furnished rentals', contact: 'Use NestAway customer care' },
    { rank: 15, name: 'HomeBazaar.com', website: 'homebazaar.com', focus: 'New residential projects', contact: 'Use contact form' },
    { rank: 16, name: 'Zricks.com', website: 'zricks.com', focus: 'Projects, Listings, Data', contact: 'Use contact form' },
    { rank: 17, name: 'PropertyShare', website: 'propertyshare.in', focus: 'Fractional property ownership', contact: 'Use contact form' },
    { rank: 18, name: 'IndiaRealEstateForum', website: 'indianrealestateforum.com', focus: 'Discussions, Listings', contact: 'Use forum contacts' },
    { rank: 19, name: 'MyPropertyBoutique', website: 'mypropertyboutique.com', focus: 'Verified Listings', contact: 'Use contact form' },
    { rank: 20, name: 'PropertyCloud.in', website: 'propertycloud.in', focus: 'Residential and Commercial Listings', contact: 'Use contact form' },
    { rank: 21, name: 'PropertyHub.in', website: 'propertyhub.in', focus: 'Property listings across India', contact: 'Use contact form' },
    { rank: 22, name: 'PropertyBazar.com', website: 'propertybazar.com', focus: 'Real Estate Marketplace', contact: 'Use contact form' },
    { rank: 23, name: 'ChennaiProperties.com', website: 'chennaiproperties.com', focus: 'Chennai-specific Listings', contact: '+91 9962 5555 46' },
    { rank: 24, name: 'DelhiProperty.in', website: 'delhiproperty.in', focus: 'Delhi-specific Listings', contact: 'Use contact form' },
    { rank: 25, name: 'MumbaiFlats.in', website: 'mumbaiflats.in', focus: 'Mumbai-specific Listings', contact: 'Use contact form' },
    { rank: 26, name: 'BangaloreHomes.in', website: 'bangalorehomes.in', focus: 'Bangalore-specific Listings', contact: 'Use contact form' },
    { rank: 27, name: 'HyderabadFlats.in', website: 'hyderabadflats.in', focus: 'Hyderabad-specific Listings', contact: 'Use contact form' },
    { rank: 28, name: 'PuneRealEstate.in', website: 'punerealestate.in', focus: 'Pune-specific Listings', contact: 'Use contact form' },
    { rank: 29, name: 'AhmedabadProperty.in', website: 'ahmedabadproperty.in', focus: 'Ahmedabad-specific Listings', contact: 'Use contact form' },
    { rank: 30, name: 'KolkataHomes.in', website: 'kolkatahomes.in', focus: 'Kolkata-specific Listings', contact: 'Use contact form' },
    { rank: 31, name: 'LucknowProperty.in', website: 'lucknowproperty.in', focus: 'Lucknow-specific Listings', contact: 'Use contact form' },
    { rank: 32, name: 'FlatsDekho.in', website: 'flatsdekho.in', focus: 'Jaipur/Pan-India Listings', contact: 'Use contact form' },
    { rank: 33, name: 'Khaliplot.com', website: 'khaliplot.com', focus: 'Land/Plot Listings', contact: 'Use contact form' },
    { rank: 34, name: 'SellMyProperty.in', website: 'sellmyproperty.in', focus: 'Property Listing for Sellers', contact: 'Use contact form' },
    { rank: 35, name: 'LandForSale.in', website: 'landforsale.in', focus: 'Dedicated Land Sale Portal', contact: 'Use contact form' },
    { rank: 36, name: 'OfficeSpaceRent.in', website: 'officespacerent.in', focus: 'Office Space Rentals', contact: 'Use contact form' },
    { rank: 37, name: 'MyOfficeSpace.in', website: 'myofficespace.in', focus: 'Commercial Property Listings', contact: 'Use contact form' },
    { rank: 38, name: 'IndiaWarehouse.in', website: 'indiawarehouse.in', focus: 'Warehouse Listings', contact: 'Use contact form' },
    { rank: 39, name: 'BusinessWorldRealty', website: 'realty.businessworld.in', focus: 'Commercial Property News/Listings', contact: 'Use contact form' },
    { rank: 40, name: 'PropLeaf.com', website: 'propleaf.com', focus: 'Commercial & Residential Listings', contact: 'Use contact form' },
    { rank: 41, name: 'CitySpaceIndia.com', website: 'cityspaceindia.com', focus: 'Office Space Listings', contact: 'Use contact form' },
    { rank: 42, name: 'IndiaOfficeSpace.com', website: 'indiaofficespace.com', focus: 'Office Space Listings', contact: 'Use contact form' },
    { rank: 43, name: 'RentMantra.com', website: 'rentmantra.com', focus: 'Rental Property Listings', contact: 'Use contact form' },
    { rank: 44, name: 'HouseRentingIndia.com', website: 'houserentingindia.com', focus: 'Rental Property Listings', contact: 'Use contact form' },
    { rank: 45, name: 'QuickRent.in', website: 'quickrent.in', focus: 'Rental Property Platform', contact: 'Use contact form' },
    { rank: 46, name: 'Roomster.in', website: 'roomster.in', focus: 'Shared Accommodation/Flatmates', contact: 'Use contact form' },
    { rank: 47, name: 'FlatMate.in', website: 'flatmate.in', focus: 'Flatmates and Shared Accommodation', contact: 'Use contact form' },
    { rank: 48, name: 'Omprep.com', website: 'omprep.com', focus: 'Property Search Platform', contact: 'Use contact form' },
    { rank: 49, name: 'PropertyKaab.com', website: 'propertykaab.com', focus: 'Residential & Commercial Listings', contact: 'Use contact form' },
    { rank: 50, name: 'PropertyPlusIndia.com', website: 'propertyplusindia.com', focus: 'Listings for New Projects', contact: 'Use contact form' },
];

const globalWebsites = [
    { rank: 1, name: 'Zillow', website: 'zillow.com', focus: 'Residential Listings (USA)', contact: 'Use contact form' },
    { rank: 2, name: 'Realtor.com', website: 'realtor.com', focus: 'Residential Listings (USA)', contact: '1-800-878-4166' },
    { rank: 3, name: 'Rightmove', website: 'rightmove.co.uk', focus: 'UK\'s largest Portal (Sales/Rentals)', contact: 'Use contact form' },
    { rank: 4, name: 'Apartments.com', website: 'apartments.com', focus: 'Rental Listings (USA)', contact: '1-888-658-7368' },
    { rank: 5, name: 'ImmoScout24', website: 'immoscout24.de', focus: 'Germany\'s largest Portal', contact: 'Use contact form' },
    { rank: 6, name: 'Idealista', website: 'idealista.com', focus: 'Spain, Italy, Portugal', contact: 'Use contact form' },
    { rank: 7, name: 'Trulia', website: 'trulia.com', focus: 'Listings, Neighborhood Info (USA)', contact: 'Use contact form' },
    { rank: 8, name: 'Redfin', website: 'redfin.com', focus: 'Tech Brokerage & Listings (USA)', contact: '1-877-973-3334' },
    { rank: 9, name: 'Realestate.com.au', website: 'realestate.com.au', focus: 'Australia\'s largest Portal', contact: 'Use contact form' },
    { rank: 10, name: 'Zoopla', website: 'zoopla.co.uk', focus: 'UK Portal (Sales/Rentals)', contact: 'Use contact form' },
    { rank: 11, name: 'Realtor.ca', website: 'realtor.ca', focus: 'Listings in Canada', contact: 'Use contact form' },
    { rank: 12, name: 'Homes.com', website: 'homes.com', focus: 'Property Listings (USA)', contact: '1-800-431-5509' },
    { rank: 13, name: 'Seloger', website: 'seloger.com', focus: 'France\'s Leading Portal', contact: 'Use contact form' },
    { rank: 14, name: 'Immobiliare.it', website: 'immobiliare.it', focus: 'Italy\'s Leading Portal', contact: 'Use contact form' },
    { rank: 15, name: 'Funda', website: 'funda.nl', focus: 'Netherlands\' Leading Portal', contact: 'Use contact form' },
    { rank: 16, name: 'Domain.com.au', website: 'domain.com.au', focus: 'Australian Listings', contact: 'Use contact form' },
    { rank: 17, name: 'PropertyGuru', website: 'propertyguru.com.sg', focus: 'Singapore/SE Asia\'s Leading Group', contact: '+65 6238 5971' },
    { rank: 18, name: 'LoopNet', website: 'loopnet.com', focus: 'Commercial Real Estate (Global)', contact: 'Use contact form' },
    { rank: 19, name: 'PropertyFinder', website: 'propertyfinder.ae', focus: 'UAE/MENA Region', contact: 'Use contact form' },
    { rank: 20, name: 'Suumo', website: 'suumo.jp', focus: 'Japan\'s Major Portal', contact: 'Use contact form' },
    { rank: 21, name: 'ImmoWelt', website: 'immowelt.de', focus: 'Germany Portal', contact: 'Use contact form' },
    { rank: 22, name: 'OnTheMarket', website: 'onthemarket.com', focus: 'UK Portal', contact: 'Use contact form' },
    { rank: 23, name: 'Property24', website: 'property24.com', focus: 'South Africa', contact: 'Use contact form' },
    { rank: 24, name: 'Hemnet', website: 'hemnet.se', focus: 'Sweden\'s Leading Portal', contact: 'Use contact form' },
    { rank: 25, name: 'Daft.ie', website: 'daft.ie', focus: 'Ireland\'s Leading Portal', contact: 'Use contact form' },
    { rank: 26, name: 'Zap Imóveis', website: 'zapimoveis.com.br', focus: 'Brazil\'s Major Portal', contact: 'Use contact form' },
    { rank: 27, name: 'Vivareal', website: 'vivareal.com.br', focus: 'Brazil\'s Major Portal', contact: 'Use contact form' },
    { rank: 28, name: 'Fotocasa', website: 'fotocasa.es', focus: 'Spain Portal', contact: 'Use contact form' },
    { rank: 29, name: 'Centris.ca', website: 'centris.ca', focus: 'Quebec, Canada Listings', contact: 'Use contact form' },
    { rank: 30, name: 'Oikotie.fi', website: 'oikotie.fi', focus: 'Finland\'s Leading Portal', contact: 'Use contact form' },
    { rank: 31, name: 'CIAN', website: 'cian.ru', focus: 'Russia\'s Major Portal', contact: 'Use contact form' },
    { rank: 32, name: 'Otodom', website: 'otodom.pl', focus: 'Poland\'s Major Portal', contact: 'Use contact form' },
    { rank: 33, name: 'Nestoria', website: 'nestoria.com', focus: 'Global Property Aggregator', contact: 'Use contact form' },
    { rank: 34, name: 'GlobalListings', website: 'globallistings.com', focus: 'Worldwide Listings', contact: 'Use contact form' },
    { rank: 35, name: 'Trovit', website: 'trovit.com', focus: 'Global Meta-Search', contact: 'Use contact form' },
    { rank: 36, name: 'Mitula', website: 'mitula.com', focus: 'Global Classifieds/Meta-Search', contact: 'Use contact form' },
    { rank: 37, name: 'Gumtree', website: 'gumtree.com.au', focus: 'Classifieds (Australia, UK)', contact: 'Use contact form' },
    { rank: 38, name: 'DDProperty', website: 'ddproperty.com', focus: 'Thailand Portal (PropertyGuru Group)', contact: 'Use contact form' },
    { rank: 39, name: 'iProperty.com.my', website: 'iproperty.com.my', focus: 'Malaysia\'s Leading Portal', contact: 'Use contact form' },
    { rank: 40, name: '99.co', website: '99.co', focus: 'Singapore/Indonesia', contact: 'Use contact form' },
    { rank: 41, name: 'Zameen.com', website: 'zameen.com', focus: 'Pakistan\'s Leading Portal', contact: 'Use contact form' },
    { rank: 42, name: 'Bayut', website: 'bayut.com', focus: 'UAE Portal', contact: 'Use contact form' },
    { rank: 43, name: 'Immoweb', website: 'immoweb.be', focus: 'Belgium\'s Leading Portal', contact: 'Use contact form' },
    { rank: 44, name: 'Idealista.it', website: 'idealista.it', focus: 'Italy Portal', contact: 'Use contact form' },
    { rank: 45, name: 'QuintoAndar', website: 'quintoandar.com.br', focus: 'Brazil\'s Rental Platform', contact: 'Use contact form' },
    { rank: 46, name: 'Trulioo (Global)', website: 'trulioo.com', focus: 'Verification/Identity (Real Estate Focus)', contact: 'Use contact form' },
    { rank: 47, name: 'Global List Hub', website: 'listglobally.com', focus: 'International Listing Syndication', contact: 'Use contact form' },
    { rank: 48, name: 'Houzz (Real Estate)', website: 'houzz.com', focus: 'Home Renovation & Design (USA)', contact: 'Use contact form' },
    { rank: 49, name: 'Rent.com', website: 'rent.com', focus: 'Rental Listings (USA)', contact: '1-800-419-5888' },
];

const indianBrokers = [
    { rank: 1, name: 'DLF Ltd.', website: 'dlf.in', focus: 'Integrated Townships, Luxury (North India)', contact: '+91 124 459 2000' },
    { rank: 2, name: 'Lodha Group', website: 'lodhagroup.in', focus: 'Residential, Luxury, Affordable (Mumbai-Centric)', contact: '+91 22 4945 5000' },
    { rank: 3, name: 'Godrej Properties', website: 'godrejproperties.com', focus: 'Residential, Commercial, Pan-India', contact: '1800 258 2588' },
    { rank: 4, name: 'Prestige Group', website: 'prestigegroup.in', focus: 'South India (Residential, Commercial, Retail)', contact: '+91 80 2559 1080' },
    { rank: 5, name: 'Oberoi Realty', website: 'oberoirealty.com', focus: 'Upscale Residential, Commercial (Mumbai)', contact: '+91 22 6677 3333' },
    { rank: 6, name: 'Brigade Group', website: 'brigadegroup.com', focus: 'South India (Residential, Commercial, Hospitality)', contact: '1800 102 9977' },
    { rank: 7, name: 'JLL India', website: 'jll.co.in', focus: 'Commercial Real Estate Services, Advisory', contact: '+91 22 6747 3000' },
    { rank: 8, name: 'CBRE India', website: 'cbre.co.in', focus: 'Commercial Real Estate Services', contact: '+91 80 4046 5500' },
    { rank: 9, name: 'Sobha Ltd.', website: 'sobha.com', focus: 'Premium Residential, Integrated Townships', contact: '+91 80 4933 0000' },
    { rank: 10, name: 'TATA Housing', website: 'tatahousing.in', focus: 'Residential, Affordable Housing', contact: 'Use contact form' },
    { rank: 11, name: 'Anant Raj Ltd.', website: 'anantrajlimited.com', focus: 'Residential, Commercial (NCR Focus)', contact: '+91 11 4300 0000' },
    { rank: 12, name: 'Shriram Properties', website: 'shriramproperties.com', focus: 'Residential (South India Focus)', contact: '1800 102 9355' },
    { rank: 13, name: 'L&T Realty', website: 'lntrealty.com', focus: 'Residential & Commercial', contact: 'Use contact form' },
    { rank: 14, name: 'Embassy Group', website: 'embassyindia.com', focus: 'Commercial (Office Parks), Residential', contact: '+91 80 4179 9999' },
    { rank: 15, name: 'Puravankara', website: 'puravankara.com', focus: 'Residential (South India)', contact: '1860 208 0000' },
    { rank: 16, name: 'Mahindra Lifespaces', website: 'mahindralifespaces.com', focus: 'Sustainable Residential, Integrated Cities', contact: '+91 22 6747 8600' },
    { rank: 17, name: 'K Raheja Corp', website: 'krahejacorp.com', focus: 'Commercial, Retail, Residential', contact: '+91 22 2496 6666' },
    { rank: 18, name: 'Phoenix Mills', website: 'thephoenixmills.com', focus: 'Retail (Malls), Commercial', contact: '+91 22 3001 1000' },
    { rank: 19, name: 'Indiabulls Real Est', website: 'indiabullsrealestate.com', focus: 'Residential, Commercial', contact: 'Use contact form' },
    { rank: 20, name: 'Kalpataru Ltd.', website: 'kalpataru.com', focus: 'Residential, Commercial', contact: '+91 22 3064 3333' },
    { rank: 21, name: 'Signature Global', website: 'signatureglobal.in', focus: 'Affordable, Mid-Housing (NCR)', contact: '+91 124 490 8000' },
    { rank: 22, name: 'Sunteck Realty', website: 'sunteckindia.com', focus: 'Luxury Residential (Mumbai)', contact: '+91 22 4280 8888' },
    { rank: 23, name: 'Keystone Realtors', website: 'rustomjee.com', focus: 'Residential (Mumbai-based)', contact: '1800 22 5588' },
    { rank: 24, name: 'Cushman & Wakefield', website: 'cushmanwakefield.com/en/india', focus: 'Commercial Services', contact: 'Use India contact details' },
    { rank: 25, name: 'Colliers India', website: 'colliers.com/en-in', focus: 'Commercial Advisory', contact: 'Use India contact details' },
    { rank: 26, name: 'Knight Frank India', website: 'knightfrank.co.in', focus: 'Residential, Commercial, Advisory', contact: '+91 22 6710 4000' },
    { rank: 27, name: 'Home Konnect', website: 'homekonnect.com', focus: 'Chennai Residential Brokerage', contact: '+91-44-6120-9000' },
    { rank: 28, name: 'Prosperty REA', website: 'prosperty.in', focus: 'Chennai Residential Advisory', contact: '+91-44-4100-5555' },
    { rank: 29, name: 'Marg Properties', website: 'margproperties.com', focus: 'Developer (South India)', contact: '+91-44-2812-0000' },
    { rank: 30, name: 'Kavin Real Estate', website: 'kavinrealestate.com', focus: 'Chennai Residential/Land Broker', contact: '+91-44-2431-5555' },
    { rank: 31, name: 'VGN Homes', website: 'vgnhomes.com', focus: 'Developer (Chennai Focus)', contact: '+91 44 2619 3333' },
    { rank: 32, name: 'Arun Excello', website: 'arunexcello.com', focus: 'Developer (Chennai Focus)', contact: '+91 44 2835 1520' },
    { rank: 33, name: 'Ozone Group', website: 'ozonegroup.com', focus: 'Developer (South India)', contact: '1800 120 7351' },
    { rank: 34, name: 'Casagrand', website: 'casagrand.co.in', focus: 'Developer (South India)', contact: '1800 425 2565' },
    { rank: 35, name: 'Akshaya Homes', website: 'akshayahomes.com', focus: 'Developer (Chennai Focus)', contact: '1800 425 7899' },
    { rank: 36, name: 'Jones Lang LaSalle', website: 'jll.co.in', focus: 'Commercial Services (India)', contact: '+91 22 6747 3000' },
    { rank: 37, name: 'HDFC Realty', website: 'hdfcrealty.com', focus: 'Residential Brokerage & Advisory', contact: 'Use HDFC customer care' },
    { rank: 38, name: 'Capdeal Realty', website: 'capdealrealty.com', focus: 'East India Brokerage', contact: 'Use contact form' },
    { rank: 39, name: 'Royal Realtors Group', website: 'royalrealtorsgroup.com', focus: 'Mumbai Brokerage', contact: '+91 22 6681 8888' },
    { rank: 40, name: 'Winworld Realty', website: 'winworldrealty.in', focus: 'Commercial Brokerage (Gurugram)', contact: '+91 9810 037 401' },
    { rank: 41, name: 'Propacity', website: 'propacity.com', focus: 'PropTech Sales/Advisory', contact: 'Use contact form' },
    { rank: 42, name: 'Godrej Housing Finance', website: 'godrejhf.com', focus: 'Home Loans (Developer related)', contact: 'Use customer care' },
    { rank: 43, name: 'India Infoline RE', website: 'iiflrealty.com', focus: 'Financial services focused RE', contact: 'Use IIFL customer care' },
    { rank: 44, name: 'Shree Housing', website: 'shreehousing.in', focus: 'Developer (Kolkata Focus)', contact: '+91 33 2413 5218' },
    { rank: 45, name: 'Marathon Group', website: 'marathon.in', focus: 'Developer (Mumbai Focus)', contact: '+91 22 6773 6666' },
    { rank: 46, name: 'Hiranandani Group', website: 'hiranandanigroup.com', focus: 'Developer (Mumbai, Chennai)', contact: '+91 22 2576 3555' },
    { rank: 47, name: 'Emaar India', website: 'emaar-india.com', focus: 'Developer (North India Focus)', contact: '1800 123 2000' },
    { rank: 48, name: 'Adani Realty', website: 'adanirealty.com', focus: 'Developer (Gujarat, NCR, Mumbai)', contact: '+91 79 2656 5555' },
    { rank: 49, name: 'Gaurs Group', website: 'gaursonsindia.com', focus: 'Developer (NCR Focus)', contact: '+91 9811 700 000' },
    { rank: 50, name: 'Omaxe Ltd.', website: 'omaxe.com', focus: 'Developer (North India Focus)', contact: '1800 313 0000' },
];

const globalBrokers = [
    { rank: 1, name: 'CBRE Group', website: 'cbre.com', focus: 'Commercial Services (Global)', contact: '+1 213 613 3333' },
    { rank: 2, name: 'JLL (Jones Lang LaSalle)', website: 'jll.com', focus: 'Commercial Services, Investment (Global)', contact: '+1 312 782 5800' },
    { rank: 3, name: 'Keller Williams Realty', website: 'kw.com', focus: 'Residential Franchise (Largest by Agent Count)', contact: '+1 512 327 3070' },
    { rank: 4, name: 'Anywhere Real Estate', website: 'anywhere.re', focus: 'Parent Co. (C21, Coldwell Banker, ERA)', contact: 'Use specific brand contacts' },
    { rank: 5, name: 'Coldwell Banker', website: 'coldwellbanker.com', focus: 'Residential Franchise (Global)', contact: 'Use local office contacts' },
    { rank: 6, name: 'RE/MAX', website: 'remax.com', focus: 'Residential Franchise Network (Global)', contact: '+1 303 770 5531' },
    { rank: 7, name: 'Cushman & Wakefield', website: 'cushmanwakefield.com', focus: 'Commercial Services (Global)', contact: '+1 312 853 0800' },
    { rank: 8, name: 'Colliers', website: 'colliers.com', focus: 'Commercial Services, Investment Management (Global)', contact: '+1 416 960 9500' },
    { rank: 9, name: 'Compass', website: 'compass.com', focus: 'Tech-Enabled Brokerage (USA)', contact: '1-866-936-4708' },
    { rank: 10, name: 'eXp Realty', website: 'expworldholdings.com', focus: 'Cloud-Based Brokerage (Global)', contact: '+1 360 685 4206' },
    { rank: 11, name: 'Sotheby\'s Intl. Realty', website: 'sothebysrealty.com', focus: 'Luxury Residential Franchise (Global)', contact: 'Use local affiliate contacts' },
    { rank: 12, name: 'Century 21', website: 'century21.com', focus: 'Residential Franchise (Global)', contact: 'Use local office contacts' },
    { rank: 13, name: 'Newmark', website: 'nmrk.com', focus: 'Commercial Services (Global)', contact: '+1 212 372 2000' },
    { rank: 14, name: 'Berkshire Hathaway HS', website: 'bhhsneproperties.com', focus: 'Residential Franchise (Global)', contact: 'Use local office contacts' },
    { rank: 15, name: 'Hines', website: 'hines.com', focus: 'Commercial Development/Investment (Global)', contact: '+1 713 621 8000' },
    { rank: 16, name: 'Savills', website: 'savills.com', focus: 'Global Real Estate Services (UK-based)', contact: '+44 20 7499 8644' },
    { rank: 17, name: 'Tishman Speyer', website: 'tishmanspeyer.com', focus: 'Commercial Development (Global)', contact: '+1 212 715 0300' },
    { rank: 18, name: 'Brookfield Asset Mngt', website: 'brookfield.com', focus: 'Real Estate Investment/Asset Mngt (Global)', contact: '+1 416 363 9491' },
    { rank: 19, name: 'Prologis', website: 'prologis.com', focus: 'Logistics Real Estate (Global)', contact: '+1 415 394 9000' },
    { rank: 20, name: 'Boston Properties', website: 'bostonproperties.com', focus: 'Office REIT (USA Focus)', contact: '+1 617 236 3300' },
    { rank: 21, name: 'Vonovia SE', website: 'vonovia.de/en', focus: 'Residential Property Company (Europe)', contact: '+49 234 314 0' },
    { rank: 22, name: 'Greystar RE Partners', website: 'greystar.com', focus: 'Rental/Multifamily (Global)', contact: '+1 843 579 9696' },
    { rank: 23, name: 'Emaar Properties', website: 'emaar.com', focus: 'Developer (Middle East Focus)', contact: '800 EMAAR (UAE)' },
    { rank: 24, name: 'Mitsui Fudosan', website: 'mitsuifudosan.co.jp/english', focus: 'Developer (Japan Focus)', contact: 'Use contact form' },
    { rank: 25, name: 'Simon Property Group', website: 'simon.com', focus: 'Retail REIT (Global Malls)', contact: '+1 317 636 1600' },
    { rank: 26, name: 'Christies Intl RE', website: 'christiesrealestate.com', focus: 'Luxury Brokerage', contact: 'Use contact form' },
    { rank: 27, name: 'Douglas Elliman', website: 'elliman.com', focus: 'Luxury Brokerage (USA)', contact: '+1 212 891 7000' },
    { rank: 28, name: 'Howard Hanna RE Svc', website: 'howardhanna.com', focus: 'Largest Family-Owned (USA)', contact: 'Use local office contacts' },
    { rank: 29, name: 'Realty ONE Group', website: 'realtyonegroup.com', focus: 'Residential Franchise (Global)', contact: '+1 949 292 2727' },
    { rank: 30, name: 'Better Homes & Grdns', website: 'bhgre.com', focus: 'Residential Franchise (USA)', contact: 'Use local office contacts' },
    { rank: 31, name: 'ERA Real Estate', website: 'era.com', focus: 'Residential Franchise', contact: 'Use local office contacts' },
    { rank: 32, name: 'Weichert Realtors', website: 'weichert.com', focus: 'Residential Brokerage (USA)', contact: '1-800-401-4444' },
    { rank: 33, name: 'Movoto', website: 'movoto.com', focus: 'Online Brokerage (USA)', contact: 'Use contact form' },
    { rank: 34, name: 'First Team RE', website: 'firstteam.com', focus: 'Regional Brokerage (California)', contact: '1-800-745-6677' },
    { rank: 35, name: 'Engel & Völkers', website: 'engelvoelkers.com', focus: 'Luxury Residential/Commercial (Global)', contact: 'Use local office contacts' },
    { rank: 36, name: 'Avison Young', website: 'avisonyoung.com', focus: 'Commercial Services (Global)', contact: '+1 416 955 0001' },
    { rank: 37, name: 'Berkadia', website: 'berkadia.com', focus: 'Commercial Mortgage Banking', contact: '+1 215 328 1700' },
    { rank: 38, name: 'Altarea Cogedim', website: 'altarea.com', focus: 'Developer (France)', contact: '+33 1 45 44 95 00' },
    { rank: 39, name: 'China Vanke Co Ltd', website: 'vanke.com/en', focus: 'Developer (China)', contact: '+86 755 2560 6666' },
    { rank: 40, name: 'Country Garden Hldgs', website: 'countrygarden.com.cn/en', focus: 'Developer (China)', contact: '+86 757 2633 6666' },
    { rank: 41, name: 'Longfor Group', website: 'longfor.com', focus: 'Developer (China)', contact: '+86 10 8466 3000' },
    { rank: 42, name: 'Unibail-Rodamco-Wfd', website: 'urw.com', focus: 'Retail REIT (Europe/USA)', contact: 'Use contact form' },
    { rank: 43, name: 'Frasers Property', website: 'frasersproperty.com', focus: 'Diversified Developer (Asia-Pacific, Europe)', contact: '+65 6276 4882' },
    { rank: 44, name: 'Lendlease', website: 'lendlease.com', focus: 'Developer/Investment Mngt (Global)', contact: '+61 2 9236 6111' },
    { rank: 45, name: 'Kennedy Wilson', website: 'kennedywilson.com', focus: 'Real Estate Investment (Global)', contact: '+1 310 887 6400' },
    { rank: 46, name: 'DAMAC Properties', website: 'damacproperties.com', focus: 'Developer (Middle East Focus)', contact: '+971 4 373 1000' },
    { rank: 47, name: 'Aldar Properties', website: 'aldar.com', focus: 'Developer (UAE Focus)', contact: '800 ALDAR (UAE)' },
    { rank: 48, name: 'China Overseas Land', website: 'coli.com.hk/en', focus: 'Developer (China/HK)', contact: '+852 2823 8888' },
    { rank: 49, name: 'Prologis (India)', website: 'prologis.in', focus: 'Logistics Real Estate (India)', contact: 'Use contact form' },
    { rank: 50, name: 'Zillow Group (Agents)', website: 'zillowgroup.com', focus: 'Brokerage arm (USA)', contact: 'Use contact form' },
];

const globalDevelopers = [
    { rank: 1, name: 'Blackstone', website: 'blackstone.com/what-we-do/real-estate', focus: 'Global Real Estate Investment', contact: '+1 212 583 5000' },
    { rank: 2, name: 'Brookfield Asset Management', website: 'brookfield.com/our-business/real-estate', focus: 'Global Real Estate Investment', contact: '+1 416 363 9491' },
    { rank: 3, name: 'Hines', website: 'hines.com', focus: 'Global Development & Investment', contact: '+1 713 621 8000' },
    { rank: 4, name: 'Tishman Speyer', website: 'tishmanspeyer.com', focus: 'Global Development & Investment', contact: '+1 212 715 0300' },
    { rank: 5, name: 'Prologis', website: 'prologis.com', focus: 'Logistics Real Estate (Global)', contact: '+1 415 394 9000' },
    { rank: 6, name: 'Emaar Properties', website: 'emaar.com', focus: 'Developer (Middle East Focus)', contact: '800 EMAAR (UAE)' },
    { rank: 7, name: 'Lendlease', website: 'lendlease.com', focus: 'Developer/Investment Mngt (Global)', contact: '+61 2 9236 6111' },
    { rank: 8, name: 'Simon Property Group', website: 'simon.com', focus: 'Retail REIT (Global Malls)', contact: '+1 317 636 1600' },
    { rank: 9, name: 'Vornado Realty Trust', website: 'vno.com', focus: 'Office/Retail REIT (USA Focus)', contact: '+1 212 894 7000' },
    { rank: 10, name: 'Boston Properties', website: 'bxp.com', focus: 'Office REIT (USA Focus)', contact: '+1 617 236 3300' },
    { rank: 11, name: 'Unibail-Rodamco-Westfield', website: 'urw.com', focus: 'Retail REIT (Europe/USA)', contact: 'Use contact form' },
    { rank: 12, name: 'China Vanke Co Ltd', website: 'vanke.com/en', focus: 'Developer (China)', contact: '+86 755 2560 6666' },
    { rank: 13, name: 'Country Garden Holdings', website: 'countrygarden.com.cn/en', focus: 'Developer (China)', contact: '+86 757 2633 6666' },
    { rank: 14, name: 'Sun Hung Kai Properties', website: 'shkp.com/en', focus: 'Developer (Hong Kong)', contact: '+852 2827 8111' },
    { rank: 15, name: 'Mitsui Fudosan', website: 'mitsuifudosan.co.jp/english', focus: 'Developer (Japan Focus)', contact: 'Use contact form' },
    { rank: 16, name: 'Vonovia SE', website: 'vonovia.de/en', focus: 'Residential Property Company (Europe)', contact: '+49 234 314 0' },
    { rank: 17, name: 'Greystar Real Estate Partners', website: 'greystar.com', focus: 'Rental/Multifamily (Global)', contact: '+1 843 579 9696' },
    { rank: 18, name: 'GLP', website: 'glp.com', focus: 'Logistics/Digital Infrastructure (Global)', contact: 'Use regional contacts' },
    { rank: 19, name: 'Mapletree Investments', website: 'mapletree.com.sg', focus: 'Real Estate Development/Investment (Singapore-based)', contact: '+65 6377 6111' },
    { rank: 20, name: 'CapitaLand', website: 'capitaland.com', focus: 'Diversified Real Estate Group (Singapore-based)', contact: '+65 6713 2888' },
    { rank: 21, name: 'Longfor Group', website: 'longfor.com', focus: 'Developer (China)', contact: '+86 10 8466 3000' },
    { rank: 22, name: 'China Resources Land', website: 'crland.com.hk', focus: 'Developer (China)', contact: '+852 2877 2330' },
    { rank: 23, name: 'Poly Developments and Holdings', website: 'polycn.com', focus: 'Developer (China)', contact: '+86 20 8989 8888' },
    { rank: 24, name: 'CK Asset Holdings', website: 'ckah.com', focus: 'Developer (Hong Kong)', contact: '+852 2128 8888' },
    { rank: 25, name: 'Frasers Property', website: 'frasersproperty.com', focus: 'Diversified Developer (Asia-Pacific, Europe)', contact: '+65 6276 4882' },
    { rank: 26, name: 'Gecina', website: 'gecina.fr/en', focus: 'Office REIT (Paris)', contact: '+33 1 40 40 50 50' },
    { rank: 27, name: 'Icade', website: 'icade.fr/en', focus: 'Commercial/Healthcare REIT (France)', contact: '+33 1 41 57 70 00' },
    { rank: 28, name: 'British Land', website: 'britishland.com', focus: 'Commercial REIT (UK)', contact: '+44 20 7486 4466' },
    { rank: 29, name: 'Landsec', website: 'landsec.com', focus: 'Commercial REIT (UK)', contact: '+44 20 7413 9000' },
    { rank: 30, name: 'Alexandria RE Equities', website: 'are.com', focus: 'Life Science REIT (USA)', contact: '+1 626 578 0777' },
    { rank: 31, name: 'Digital Realty', website: 'digitalrealty.com', focus: 'Data Center REIT (Global)', contact: '+1 877 321 3334' },
    { rank: 32, name: 'Equinix', website: 'equinix.com', focus: 'Data Center REIT (Global)', contact: '+1 888 222 1162' },
    { rank: 33, name: 'Deutsche Wohnen', website: 'deutsche-wohnen.com', focus: 'Residential (Germany)', contact: 'Use contact form' },
    { rank: 34, name: 'LEG Immobilien', website: 'leg-immobilien.de/en', focus: 'Residential (Germany)', contact: '+49 211 45 68 0' },
    { rank: 35, name: 'Mirvac', website: 'mirvac.com', focus: 'Diversified Developer (Australia)', contact: '+61 2 9080 8000' },
    { rank: 36, name: 'Stockland', website: 'stockland.com.au', focus: 'Diversified Developer (Australia)', contact: '+61 2 9035 2000' },
    { rank: 37, name: 'Dexus', website: 'dexus.com', focus: 'Office/Industrial REIT (Australia)', contact: '+61 2 9017 1100' },
    { rank: 38, name: 'Goodman Group', website: 'goodman.com', focus: 'Industrial Property Group (Global)', contact: '+61 2 9230 7400' },
    { rank: 39, name: 'Welltower', website: 'welltower.com', focus: 'Healthcare REIT (USA)', contact: '+1 419 247 2800' },
    { rank: 40, name: 'Ventas', website: 'ventasreit.com', focus: 'Healthcare REIT (USA)', contact: '+1 877 483 6827' },
    { rank: 41, name: 'AvalonBay Communities', website: 'avalonbay.com', focus: 'Residential REIT (USA)', contact: '+1 703 329 6300' },
    { rank: 42, name: 'Equity Residential', website: 'equityapartments.com', focus: 'Residential REIT (USA)', contact: '+1 312 474 1300' },
    { rank: 43, name: 'Public Storage', website: 'publicstorage.com', focus: 'Self-Storage REIT (USA)', contact: '+1 800 688 8057' },
    { rank: 44, 'name': 'Extra Space Storage', 'website': 'extraspace.com', 'focus': 'Self-Storage REIT (USA)', 'contact': '+1 888 786 7243' },
    { rank: 45, 'name': 'Realty Income', 'website': 'realtyincome.com', 'focus': 'Net Lease REIT (USA)', 'contact': '+1 800 375 6700' },
    { rank: 46, 'name': 'Kennedy Wilson', 'website': 'kennedywilson.com', 'focus': 'Real Estate Investment (Global)', 'contact': '+1 310 887 6400' },
    { rank: 47, 'name': 'DAMAC Properties', 'website': 'damacproperties.com', 'focus': 'Developer (Middle East Focus)', 'contact': '+971 4 373 1000' },
    { rank: 48, 'name': 'Aldar Properties', 'website': 'aldar.com', 'focus': 'Developer (UAE Focus)', 'contact': '800 ALDAR (UAE)' },
    { rank: 49, 'name': 'China Overseas Land', 'website': 'coli.com.hk/en', 'focus': 'Developer (China/HK)', 'contact': '+852 2823 8888' },
    { rank: 50, 'name': 'Prologis (India)', 'website': 'prologis.in', 'focus': 'Logistics Real Estate (India)', 'contact': 'Use contact form' },
];

const renderWebsiteUrl = (url: string) => {
    if (!url.startsWith('http')) {
        return `https://${url}`;
    }
    return url;
}

const DataTable = ({ title, description, data, searchTerm }: { title: string, description: string, data: any[], searchTerm: string }) => {

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        const lowercasedFilter = searchTerm.toLowerCase();
        return data.filter(item => 
            (item.name && item.name.toLowerCase().includes(lowercasedFilter)) ||
            (item.website && item.website.toLowerCase().includes(lowercasedFilter)) ||
            (item.focus && item.focus.toLowerCase().includes(lowercasedFilter))
        );
    }, [data, searchTerm]);
    
    return (
    <Card>
        <CardHeader>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-2'>
              <div>
                <CardTitle className="font-headline text-2xl tracking-tight">{title}</CardTitle>
                {description && <CardDescription className='mt-1'>{description}</CardDescription>}
              </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-20 text-center">Market Rank</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Website</TableHead>
                        <TableHead>Primary Focus</TableHead>
                        <TableHead className="text-right">Contact</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.map(item => (
                        <TableRow key={item.rank + item.name}>
                            <TableCell className="text-center font-semibold">{item.rank}</TableCell>
                            <TableCell className="font-semibold">{item.name}</TableCell>
                            <TableCell>
                                <Link href={renderWebsiteUrl(item.website)} target="_blank" className="text-primary hover:underline">
                                    {item.website}
                                </Link>
                            </TableCell>
                            <TableCell>{item.focus}</TableCell>
                            <TableCell className="text-right">{item.contact}</TableCell>
                        </TableRow>
                    ))}
                    {filteredData.length === 0 && (
                         <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No results found for &quot;{searchTerm}&quot;.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
)};


export default function DashboardDirectory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                const recognition = recognitionRef.current;
                recognition.continuous = false;
                recognition.lang = 'en-US';
                recognition.interimResults = false;

                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setSearchTerm(transcript);
                    setIsListening(false);
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                };

                recognition.onend = () => {
                     setIsListening(false);
                };
            }
        }
    }, []);

    const handleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold font-headline tracking-tight">
              Real Estate Directory
            </h2>
            <p className="text-muted-foreground">
              Your central hub for top real estate portals and brokerage firms.
            </p>
        </div>
      </div>

        <div className="relative w-full">
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search across all lists (by name, website, or focus)..."
                className="w-full rounded-lg bg-background pl-11 text-base h-12 pr-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="ghost" size="icon" className="absolute right-2.5 top-2.5 h-7 w-7" onClick={handleListen} disabled={!recognitionRef.current}>
                {isListening ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4" />}
                <span className="sr-only">{isListening ? 'Stop listening' : 'Start voice search'}</span>
            </Button>
        </div>
      
      <DataTable 
        title="🇮🇳 Top 50 Indian Real Estate Websites"
        description="A mix of major property portals and classifieds with strong real estate sections."
        data={indianWebsites}
        searchTerm={searchTerm}
      />

      <DataTable 
        title="🌎 Top 50 Global Real Estate Websites"
        description="Major portals from North America, Europe, Asia-Pacific, and other key markets."
        data={globalWebsites}
        searchTerm={searchTerm}
      />

      <DataTable 
        title="🇮🇳 Top 50 Indian Brokerage & Development Firms"
        description="Major developers and advisors who control most sales in India."
        data={indianBrokers}
        searchTerm={searchTerm}
      />

      <DataTable 
        title="🌎 Top 50 Global Brokerage & Franchise Firms"
        description="The largest global brokerage and real estate services companies."
        data={globalBrokers}
        searchTerm={searchTerm}
      />

        <DataTable 
        title="🏢 Top 50 Global Development & Investment Firms"
        description="The largest global developers and real estate investment companies."
        data={globalDevelopers}
        searchTerm={searchTerm}
      />
      
    </div>
  );
}