


# Complex Query 1
# Get the top three best-valued Airbnb listings that are the closest to all the national parks where a specific species can be found.
# Example: seal
# Best-valued listing is defined as the Airbnb that is the closest and has at least 150 user reviews. 
# Expected runtime: 24s
q1 = `WITH parks AS (SELECT DISTINCT S.park_name, P.longitude, P.latitude
               FROM Park P
                        JOIN Species S ON P.park_name = S.park_name
               WHERE common_names LIKE '%seal%'),
     park_airbnb AS (SELECT A.name,
                            3958.8 *
                            (2 * ASIN(SQRT(POWER(SIN((RADIANS(S.latitude) - RADIANS(A.latitude)) / 2), 2) +
                                           COS(RADIANS(A.latitude)) * COS(RADIANS(S.latitude)) *
                                           POWER(SIN((RADIANS((S.longitude)) -
                                                      RADIANS(A.longitude)) / 2),
                                                 2)))) AS distance_to_park,
                            S.park_name,
                            A.price,
                            A.number_of_reviews,
                            A.city,
                            A.state,
                            A.host_name,
                            A.room_type,
                            A.minimum_nights,
                            A.availability_365
                     FROM parks S,
                          (SELECT * FROM Airbnb WHERE number_of_reviews > 150) A
                     GROUP BY S.park_name, S.longitude, S.latitude, A.name, A.price, A.longitude, A.latitude,
                              A.number_of_reviews, A.state, A.host_name, A.room_type, A.minimum_nights,
                              A.availability_365, A.city),
     ranked_park_airbinb AS (SELECT *,
                                    ROW_NUMBER() OVER (PARTITION BY park_name
                                        ORDER BY distance_to_park, price, number_of_reviews DESC) AS ranking
                             FROM park_airbnb)
SELECT *
FROM ranked_park_airbinb
WHERE ranking < 4
GROUP BY name, distance_to_park, park_name, price, number_of_reviews, city, state, host_name, room_type, minimum_nights, availability_365
ORDER BY distance_to_park;`

# Complex Query 1 Version 2
# In a specific state, get the top three Airbnb listings that are the closest to all the national parks where a specific species can be found.
# Example: state = CA, species = seal
# Expected runtime: 8s
q1 = `WITH parks AS (SELECT DISTINCT S.park_name, P.longitude, P.latitude
               FROM Park P
                        JOIN Species S ON P.park_name = S.park_name
               WHERE common_names LIKE '%seal%' AND state LIKE '%CA%'),
     park_airbnb AS (SELECT A.name,
                            3958.8 *
                            (2 * ASIN(SQRT(POWER(SIN((RADIANS(S.latitude) - RADIANS(A.latitude)) / 2), 2) +
                                           COS(RADIANS(A.latitude)) * COS(RADIANS(S.latitude)) *
                                           POWER(SIN((RADIANS((S.longitude)) -
                                                      RADIANS(A.longitude)) / 2),
                                                 2)))) AS distance_to_park,
                            S.park_name,
                            A.price,
                            A.number_of_reviews,
                            A.city,
                            A.state,
                            A.host_name,
                            A.room_type,
                            A.minimum_nights,
                            A.availability_365
                     FROM parks S,
                          (SELECT * FROM Airbnb WHERE state LIKE '%CA%') A
                     GROUP BY S.park_name, S.longitude, S.latitude, A.name, A.price, A.longitude, A.latitude,
                              A.number_of_reviews, A.state, A.host_name, A.room_type, A.minimum_nights,
                              A.availability_365, A.city),
     ranked_park_airbinb AS (SELECT *,
                                    ROW_NUMBER() OVER (PARTITION BY park_name
                                        ORDER BY distance_to_park, price, number_of_reviews DESC) AS ranking
                             FROM park_airbnb)
SELECT *
FROM ranked_park_airbinb
WHERE ranking < 4
GROUP BY name, distance_to_park, park_name, price, number_of_reviews, city, state, host_name, room_type, minimum_nights, availability_365
ORDER BY distance_to_park;`

# Complex Query 2
q2 = ``

# Complex Query 3
q3 = ``

# Complex Query 4
# Get top 10 most frequently appeared species in the nearby parks of the 100 top-rated Airbnbs 
# that have trails with popularity less than or equal to 200 (e.g. Photography routes recommendation with more species and less people)
q4 = `

WITH top_airbnbs AS (
  SELECT *
  FROM Airbnb
  ORDER BY number_of_reviews DESC
  LIMIT 100
),

nearby_parks AS (
  SELECT DISTINCT a.id, p.park_code
  FROM top_airbnbs a
  JOIN Park p ON (
      3958.8 * (2 * ASIN(SQRT(POWER(SIN((RADIANS(a.latitude) - RADIANS(p.latitude)) / 2), 2) +
                        COS(RADIANS(a.latitude)) * COS(RADIANS(p.latitude)) *
                        POWER(SIN((RADIANS((a.longitude)) - RADIANS(p.longitude)) / 2), 2))))
      ) <= 100
),

species_counts AS (
  SELECT s.species_id, COUNT(*) AS occurrence_count
  FROM nearby_parks np
      JOIN Trail t ON np.park_code = t.park_code
      JOIN Species s ON t.park_name = s.park_name
  WHERE t.popularity <= 6
  GROUP BY s.species_id
)

SELECT s.species_id, s.common_names, sc.occurrence_count
FROM Species s
JOIN species_counts sc ON s.species_id = sc.species_id
ORDER BY sc.occurrence_count DESC
LIMIT 10;
`


