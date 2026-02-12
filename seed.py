import urllib.request
import json

API_URL = "http://localhost:8000/api/properties"

PROPERTIES = [
    # Apartments
    {
        "name": "Centrum Apartment",
        "address": "Grote Markt 1, Groningen",
        "type": "apartment",
        "floor_area_m2": 78,
        "year_of_construction": 2008,
        "number_of_inhabitants": 2,
        "ceiling_height_m": 2.6,
    },
    {
        "name": "Paddepoel Studio",
        "address": "Zernikepark 4, Groningen",
        "type": "apartment",
        "floor_area_m2": 32,
        "year_of_construction": 1985,
        "number_of_inhabitants": 1,
        "ceiling_height_m": 2.5,
    },
    {
        "name": "Hortusbuurt Flat",
        "address": "Herestraat 44, Groningen",
        "type": "apartment",
        "floor_area_m2": 95,
        "year_of_construction": 1972,
        "number_of_inhabitants": 3,
        "ceiling_height_m": 2.8,
    },
    {
        "name": "Nieuwe Ebbingestraat Loft",
        "address": "Nieuwe Ebbingestraat 18, Groningen",
        "type": "apartment",
        "floor_area_m2": 110,
        "year_of_construction": 2019,
        "number_of_inhabitants": 2,
        "ceiling_height_m": 3.2,
    },
    {
        "name": "Korrewegwijk Apartment",
        "address": "Korreweg 55, Groningen",
        "type": "apartment",
        "floor_area_m2": 60,
        "year_of_construction": 1960,
        "number_of_inhabitants": 1,
        "ceiling_height_m": 2.7,
    },
    # Houses
    {
        "name": "Helpman Family Home",
        "address": "Helperzoom 12, Groningen",
        "type": "house",
        "floor_area_m2": 145,
        "year_of_construction": 1995,
        "number_of_inhabitants": 4,
        "ceiling_height_m": 2.6,
    },
    {
        "name": "Oosterparkwijk Terraced House",
        "address": "Oosterpark 7, Groningen",
        "type": "house",
        "floor_area_m2": 112,
        "year_of_construction": 1938,
        "number_of_inhabitants": 3,
        "ceiling_height_m": 3.0,
    },
    {
        "name": "Zuidlaren Villa",
        "address": "Stationsweg 3, Zuidlaren",
        "type": "house",
        "floor_area_m2": 220,
        "year_of_construction": 2015,
        "number_of_inhabitants": 5,
        "ceiling_height_m": 2.8,
    },
    {
        "name": "Paterswolde Detached House",
        "address": "Hoofdweg 88, Paterswolde",
        "type": "house",
        "floor_area_m2": 175,
        "year_of_construction": 1978,
        "number_of_inhabitants": 4,
        "ceiling_height_m": 2.6,
    },
    # Offices
    {
        "name": "Europapark Office",
        "address": "Leonard Springerlaan 9, Groningen",
        "type": "office",
        "floor_area_m2": 340,
        "year_of_construction": 2003,
        "number_of_inhabitants": 12,
        "ceiling_height_m": 3.0,
    },
    {
        "name": "Zernike Campus Unit",
        "address": "Nettelbosje 2, Groningen",
        "type": "office",
        "floor_area_m2": 180,
        "year_of_construction": 2017,
        "number_of_inhabitants": 8,
        "ceiling_height_m": 3.5,
    },
    {
        "name": "Binnenstad Office Space",
        "address": "Zwanestraat 21, Groningen",
        "type": "office",
        "floor_area_m2": 95,
        "year_of_construction": 1955,
        "number_of_inhabitants": 5,
        "ceiling_height_m": 4.0,
    },
    {
        "name": "Westerhaven Business Centre",
        "address": "Westerhaven 14, Groningen",
        "type": "office",
        "floor_area_m2": 520,
        "year_of_construction": 1998,
        "number_of_inhabitants": 25,
        "ceiling_height_m": 3.2,
    },
]


def seed():
    ok = 0
    failed = 0

    for prop in PROPERTIES:
        data = json.dumps(prop).encode("utf-8")
        req = urllib.request.Request(
            API_URL,
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req) as resp:
                result = json.loads(resp.read())
                print(f"  ✓  {result['name']} ({result['type']}, {prop['floor_area_m2']} m²)")
                ok += 1
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            print(f"  ✗  {prop['name']} — HTTP {e.code}: {body}")
            failed += 1
        except Exception as e:
            print(f"  ✗  {prop['name']} — {e}")
            failed += 1

    print(f"\nDone: {ok} created, {failed} failed.")


if __name__ == "__main__":
    seed()