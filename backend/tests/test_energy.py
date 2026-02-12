from datetime import date
from app.energy import generate_energy

# A reusable base set of arguments so each test only changes what it cares about
BASE = dict(
    property_id="11111111-1111-1111-1111-111111111111",
    floor_area_m2=100,
    year_of_construction=2000,
    number_of_inhabitants=2,
    ceiling_height_m=2.5,
    property_type="apartment",
)


def test_returns_correct_number_of_days():
    result = generate_energy(**BASE, days=30)
    assert len(result) == 30


def test_each_entry_has_date_and_kwh():
    result = generate_energy(**BASE, days=5)
    for entry in result:
        assert "date" in entry
        assert "kwh" in entry
        assert isinstance(entry["kwh"], float)


def test_dates_are_valid_iso_strings():
    result = generate_energy(**BASE, days=5)
    for entry in result:
        # Will raise ValueError if the format is wrong
        date.fromisoformat(entry["date"])


def test_larger_floor_area_uses_more_energy():
    small = generate_energy(**{**BASE, "floor_area_m2": 50}, days=30)
    large = generate_energy(**{**BASE, "floor_area_m2": 200}, days=30)

    avg_small = sum(r["kwh"] for r in small) / len(small)
    avg_large = sum(r["kwh"] for r in large) / len(large)

    assert avg_large > avg_small


def test_older_building_uses_more_energy():
    new_build = generate_energy(**{**BASE, "year_of_construction": 2020}, days=30)
    old_build = generate_energy(**{**BASE, "year_of_construction": 1950}, days=30)

    avg_new = sum(r["kwh"] for r in new_build) / len(new_build)
    avg_old = sum(r["kwh"] for r in old_build) / len(old_build)

    assert avg_old > avg_new


def test_office_uses_less_energy_on_weekends():
    # Generate enough days to guarantee we hit a weekend
    result = generate_energy(**{**BASE, "property_type": "office"}, days=30)

    weekday_kwh = []
    weekend_kwh = []

    for entry in result:
        d = date.fromisoformat(entry["date"])
        if d.weekday() < 5:
            weekday_kwh.append(entry["kwh"])
        else:
            weekend_kwh.append(entry["kwh"])

    avg_weekday = sum(weekday_kwh) / len(weekday_kwh)
    avg_weekend = sum(weekend_kwh) / len(weekend_kwh)

    assert avg_weekday > avg_weekend


def test_kwh_is_always_positive():
    result = generate_energy(**BASE, days=30)
    for entry in result:
        assert entry["kwh"] > 0