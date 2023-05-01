## TODO: add trail detail queries

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
