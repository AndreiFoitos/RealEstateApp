from datetime import date, timedelta
import random
import math

def generate_energy(property_id, floor_area_m2, year_of_construction, number_of_inhabitants, ceiling_height_m, property_type, days=30):

    random.seed(str(property_id))
    today = date.today()

    type_multipliers = {
        'apartment': 0.08,
        'house': 0.12,
        'office': 0.15,
    }
    base_rate = type_multipliers.get(property_type, 0.10)


    volume_m3 = floor_area_m2 * ceiling_height_m

    current_year = date.today().year
    building_age = current_year - year_of_construction
    
    if building_age <= 5:
        efficiency_factor = 0.7
    elif building_age <= 15:
        efficiency_factor = 0.85
    elif building_age <= 30:
        efficiency_factor = 1.0
    elif building_age <= 50:
        efficiency_factor = 1.2
    else:
        efficiency_factor = 1.4
    

    if number_of_inhabitants == 0:
        inhabitant_factor = 0.3
    else:
        inhabitant_factor = 0.5 + (math.sqrt(number_of_inhabitants) * 0.4)
    
   
    volume_factor = 1.0 + ((ceiling_height_m - 2.5) * 0.15)

    base_daily_kwh = (
        floor_area_m2 * 
        base_rate * 
        efficiency_factor * 
        inhabitant_factor * 
        volume_factor
    )
    

    data = []
    for i in range(days):
        d = today - timedelta(days=i)
        
        weekday = d.weekday()
        if property_type == 'office':
            weekday_factor = 0.4 if weekday >= 5 else 1.0
        else:
            weekday_factor = 1.1 if weekday >= 5 else 1.0
        
        random_factor = random.uniform(0.85, 1.15)

        kwh = base_daily_kwh * weekday_factor * random_factor
        
        data.append({
            "date": d.isoformat(),
            "kwh": round(kwh, 2)
        })
    
    return data