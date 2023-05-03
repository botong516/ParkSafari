# Complex Queries
# Query 1A
# For each of the national parks where a specific species can be found, get the 
# top 3 best-valued Airbnb listings that are the closest to this park. Best-valued listing is
# defined as the Airbnb that is the closest and has at least 150 user reviews.
# For example, species =seal, num = 3.
q1A=`WITH parks AS (SELECT DISTINCT S.park_name, P.longitude, P.latitude
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
GROUP BY name, distance_to_park, park_name, price, number_of_reviews, city, state, host_name, room_type, minimum_nights,
         availability_365
ORDER BY distance_to_park;`

# Query 1B
# For each of the national parks in a specific state where a specific species can be found, get the 
# top 3 best-valued Airbnb listings that are the closest to this park. Best-valued listing is
# defined as the Airbnb that is the closest and has at least 150 user reviews.
# For example, state = CA, species =seal, num = 3. 
q1B=`WITH parks AS (SELECT DISTINCT S.park_name, P.longitude, P.latitude
               FROM Park P
                        JOIN Species S ON P.park_name = S.park_name
               WHERE common_names LIKE '%seal%'
                 AND state LIKE '%CA%'),
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
GROUP BY name, distance_to_park, park_name, price, number_of_reviews, city, state, host_name, room_type, minimum_nights,
         availability_365
ORDER BY distance_to_park;`

# Query 2
# In a specified state and neighbourhood, get the top n Airbnbs that have the highest species
# count from parks within [x] miles of radius from it.
# For example, state = CA, neighbourhood = Hollywood, distance < 100 miles, num = 10
q2 = `WITH nearby_park AS (SELECT DISTINCT P.park_name, P.state, A.id
                     FROM (SELECT * FROM Park WHERE state LIKE '%CA%') P
                              JOIN (SELECT * FROM Airbnb WHERE neighbourhood = 'Hollywood') A
                                   ON EXISTS(
                                           SELECT *
                                           WHERE ((2 *
                                                   ASIN(SQRT(POWER(SIN((RADIANS(P.latitude) - RADIANS(A.latitude)) / 2), 2) +
                                                             COS(RADIANS(A.latitude)) * COS(RADIANS(A.latitude)) *
                                                             POWER(SIN((RADIANS((P.longitude)) -
                                                                        RADIANS(A.longitude)) / 2),
                                                                   2)))) < 100
                                                     )
                                       )),
     biodiverse_airbnb AS (SELECT COUNT(S.scientific_name) AS count, P.id
                           FROM Species S
                                    JOIN nearby_park P ON S.park_name = P.park_name
                           GROUP BY P.id
                           ORDER BY count DESC
                           LIMIT 10)
SELECT DISTINCT A2.*, A1.count
FROM biodiverse_airbnb A1
         JOIN Airbnb A2 ON A1.id = A2.id;`

# Complex Query 3: Popular species
# Get the top n most popular species in each park that have a trail with popularity >= 6.5731
# For example, n = 10;
q3 = `WITH COUNT AS (SELECT scientific_name, COUNT(DISTINCT park_name) AS species_count
               FROM Species
               GROUP BY scientific_name),
     popular_park_species AS (SELECT S.park_name,
                                     C.scientific_name,
                                     ROW_NUMBER() over (PARTITION BY S.park_name ORDER BY C.species_count DESC) AS ranks
                              FROM COUNT C
                                       JOIN Species S ON C.scientific_name = S.scientific_name
                                       JOIN Trail T on S.park_name = T.park_name
                              WHERE T.popularity >= 6.5731
                              GROUP BY S.park_name, C.scientific_name
                              ORDER BY S.park_name, C.species_count DESC)
SELECT *
FROM popular_park_species P
WHERE P.ranks <= 10;`

# Complex Query 4
# Get top n most frequently appeared species in the nearby parks of the 100 top-rated Airbnbs that
# have trails with popularity less than or equal to 6 (e.g. Photography routes recommendation
# with more species and fewer people)
# For example, n=10
q4=`WITH top_airbnbs AS (SELECT *
                     FROM Airbnb
                     ORDER BY number_of_reviews DESC
                     LIMIT 100),
     nearby_parks AS (SELECT DISTINCT a.id, p.park_code
                      FROM top_airbnbs a
                               JOIN Park p ON (
                                                      3958.8 * (2 *
                                                                ASIN(SQRT(POWER(SIN((RADIANS(a.latitude) - RADIANS(p.latitude)) / 2), 2) +
                                                                          COS(RADIANS(a.latitude)) *
                                                                          COS(RADIANS(p.latitude)) *
                                                                          POWER(
                                                                                  SIN((RADIANS((a.longitude)) - RADIANS(p.longitude)) / 2),
                                                                                  2))))
                                                  ) <= 100),
     species_counts AS (SELECT s.species_id, COUNT(*) AS occurrence_count
                        FROM nearby_parks np
                                 JOIN Trail t ON np.park_code = t.park_code
                                 JOIN Species s ON t.park_name = s.park_name
                        WHERE t.popularity <= 6
                        GROUP BY s.species_id)
SELECT s.species_id, s.common_names, sc.occurrence_count
FROM Species s
         JOIN species_counts sc ON s.species_id = sc.species_id
ORDER BY sc.occurrence_count DESC
LIMIT 10;`
