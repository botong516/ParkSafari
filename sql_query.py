# Complex Query 2: Most biodiverse airbnb
# In a specified state and neighbourhood, get the top 10 Airbnbs that have the highest species count in parks within [x] miles of radius
# Example, state = CA, neighbourhood = Hollywood, distance < 100 miles
# Expected runtime = 33s
q2 = `WITH nearby_park AS (SELECT DISTINCT P.park_name,
                                     P.state,
                                     A.id
                     FROM (SELECT * FROM Park WHERE state LIKE '%CA%') P
                              JOIN (SELECT * FROM Airbnb WHERE neighbourhood = 'Hollywood') A
                     WHERE ((2 * ASIN(SQRT(POWER(SIN((RADIANS(P.latitude) - RADIANS(A.latitude)) / 2), 2) +
                                           COS(RADIANS(A.latitude)) * COS(RADIANS(A.latitude)) *
                                           POWER(SIN((RADIANS((P.longitude)) -
                                                      RADIANS(A.longitude)) / 2),
                                                 2)))) < 100)),
     biodiverse_airbnb AS (SELECT COUNT(S.scientific_name) AS count, P.id
                           FROM Species S
                                    JOIN nearby_park P ON S.park_name = P.park_name
                           GROUP BY P.id
                           ORDER BY count DESC
                           LIMIT 10)
SELECT DISTINCT A2.*, A1.count
FROM biodiverse_airbnb A1
         JOIN Airbnb A2 ON A1.id = A2.id;`

"""
Get the top 10 most popular species in each park that has a trail with popularity >= 6.5731
"""
# Complex Query 3
q3 = `WITH COUNT AS (
SELECT scientific_name, COUNT(DISTINCT park_name) AS species_count
FROM Species
GROUP BY scientific_name),
popular_park_species AS (
SELECT S.park_name,C.scientific_name, ROW_NUMBER() over (PARTITION BY S.park_name ORDER BY C.species_count DESC) AS ranks
FROM COUNT C JOIN Species S ON C.scientific_name=S.scientific_name JOIN Trail T on S.park_name = T.park_name
WHERE T.popularity >= 6.5731
GROUP BY S.park_name, C.scientific_name
ORDER BY S.park_name, C.species_count DESC)
SELECT *
FROM popular_park_species P
WHERE P.ranks <=10;`

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

# Simple Queries
# Get the list of all national parks sorted by name
q5 = `SELECT park_name
FROM Park
ORDER BY park_name;`

# Get the list of all national parks sorted by area
q6 = `
SELECT park_name, acres
FROM Park
ORDER BY acres;
`

# Get the list of all national parks sorted by species count
q7 = `
SELECT p.park_name, COUNT(s.species_id) AS species_count
FROM Park p
         JOIN Species s ON p.park_name = s.park_name
GROUP BY p.park_name
ORDER BY species_count DESC;
`

# A sample filtering of trails: get the list of all trails where the corresponding park name
# includes ”Preserve” and the length is between 5000 and 10000, sorted by average ratings
q8 = `
SELECT Trail.name AS trail_name, Trail.park_name, Trail.length, Trail.avg_rating
FROM Trail
         INNER JOIN Park ON Trail.park_code = Park.park_code
WHERE Park.park_name LIKE ’ % Preserve % ’
  AND Trail.length > 5000
  AND Trail.length < 10000
ORDER BY Trail.avg_rating DESC;
`

# Get all species at a given park (ordered by category), i.e. Yellowstone National Park
q9 = `
SELECT p.park_name, s.scientific_name, s.category
FROM Park p
         JOIN Species s ON p.park_name = s.park_name
WHERE p.park_name LIKE 'Yellowstone National Park'
ORDER BY s.category;
`

# Get all parks where visitors can observe at least 10% species from ”Bird” category
q10 = `
SELECT b.park_name, b.scientific_name AS species_name
FROM (SELECT p.park_code, s.species_id
      FROM Park p
               JOIN Species s ON p.park_name = s.park_name
      WHERE s.category = 'Algae'
      GROUP BY p.park_code
      HAVING 10 * COUNT(DISTINCT s.species_id) >=
             (SELECT COUNT(DISTINCT species_id) FROM Species WHERE category = 'Algae')) a
         JOIN Species b ON a.species_id = b.species_id;
`

# Get all trails where visitors can observe at least 10% species from ”Bird” category
q11 =`
SELECT b.trail_name, b.park_name, c.scientific_name
FROM (SELECT t.name AS trail_name, a.park_name, a.species_id
      FROM (SELECT p.park_code, p.park_name, s.species_id
            FROM Park p
                     JOIN Species s ON p.park_name = s.park_name
            WHERE s.category = 'Algae'
            GROUP BY p.park_code, p.park_name
            HAVING 10 * COUNT(DISTINCT s.species_id) >=
                   (SELECT COUNT(DISTINCT species_id) FROM Species WHERE category = 'Algae')) a
               JOIN Trail t ON a.park_code = t.park_code) b
         JOIN Species c ON b.species_id = c.species_id
ORDER BY b.trail_name;
`

# Get parks where visitors can observe species from all categories
q12 = `
SELECT Park.park_code, Park.park_name
FROM Park
         JOIN Species ON Park.park_name = Species.park_name
GROUP BY Park.park_name HAV- ING COUNT(DISTINCT category) = ( SELECT COUNT(DISTINCT category) FROM Species );
`

# Get trails where visitors can observe species from all categories
q13=`
SELECT t.name AS trail_name, a.park_name
FROM (SELECT Park.park_code, Park.park_name
      FROM Park
               JOIN Species ON Park.park_name = Species.park_name
      GROUP BY Park.park_name
      HAVING COUNT(DISTINCT category) = (SELECT COUNT(DISTINCT category) FROM Species)) a
         JOIN Trail t ON a.park_code = t.park_code
ORDER BY park_name;
`

# Get all trails where a specific species can be observed
q14=`
SELECT DISTINCT T.name
FROM Species S
         JOIN Trail T ON S.park_name = T.park_name
WHERE LOCATE('user_input', common_names) > 0;
`

# Get the information about a specific Airbnb listing
q15=`
SELECT *
FROM Airbnb
WHERE id = 2708;
`

# Get the 50 closest Airbnb listings to the specified park (park_code = 'ARCH') sorted first by distance then by price and number of reviews.
q16=`
SELECT *,
       3958.8 * (2 * ASIN(SQRT(POWER(SIN((RADIANS((SELECT latitude
                                                   FROM Park
                                                   WHERE park_code = 'ARCH')) - RADIANS(Airbnb.latitude)) / 2), 2) +
                               COS(RADIANS(Airbnb.latitude)) * COS(RADIANS((SELECT latitude
                                                                            FROM Park
                                                                            WHERE park_code = 'ARCH'))) *
                               POWER(SIN((RADIANS((SELECT longitude FROM Park WHERE park_code = 'ARCH')) -
                                          RADIANS(Airbnb.longitude)) / 2),
                                     2)))) AS distance
FROM Airbnb
ORDER BY distance, price, number_of_reviews
LIMIT 50;
`
# Get the 50 closest Airbnb listings near a specific trail (trail_id = 10039522) sorted first by distance then by price and number of reviews.
q17=`
SELECT *,
       3958.8 * (2 * ASIN(SQRT(POWER(SIN((RADIANS((SELECT latitude
                                                   FROM Trail
                                                   WHERE trail_id = 10039522)) - RADIANS(Airbnb.latitude)) / 2), 2) +
                               COS(RADIANS(Airbnb.latitude)) * COS(RADIANS((SELECT latitude
                                                                            FROM Trail
                                                                            WHERE trail_id = 10039522))) *
                               POWER(SIN((RADIANS((SELECT longitude FROM Trail WHERE trail_id = 10039522)) -
                                          RADIANS(Airbnb.longitude)) / 2),
                                     2)))) AS distance
FROM Airbnb
ORDER BY distance, price, number_of_reviews
LIMIT 50;
`
