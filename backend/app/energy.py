from datetime import date, timedelta
import random

def generate_energy(property_id, days=30):
    random.seed(str(property_id))
    today = date.today()

    data = []
    for i in range(days):
        d = today - timedelta(days=i)
        kwh = random.uniform(10, 30)
        data.append({"date": d.isoformat(), "kwh": round(kwh, 2)})
    return data
