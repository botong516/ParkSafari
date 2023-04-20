/**
 * Complex Query 1
 * For each of the national parks where a specific species can be found, get the top 3 best-valued
 * Airbnb listings that are the closest to this park. Best-valued listing is defined as the Airbnb
 * that is the closest and has at least 150 user reviews.
 *
 * Expected runtime: 24s.
 *
 * @param species A common name for the species of interest.
 * @param num The number of Airbnbs to return for each park.
 * @returns The SQL query string for this search.
 */
const recommendedAirbnbForSpecies = (species, num) =>
  `WITH parks AS (SELECT DISTINCT S.park_name, P.longitude, P.latitude
               FROM Park P
                        JOIN Species S ON P.park_name = S.park_name
               WHERE common_names LIKE '%${species}%'),
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
WHERE ranking < ${num + 1}
GROUP BY name, distance_to_park, park_name, price, number_of_reviews, city, state, host_name, room_type, minimum_nights,
         availability_365
ORDER BY distance_to_park;`

/**
 * For each of the national parks in a specific state where a specific species can be found, get the
 * top 3 best-valued Airbnb listings that are the closest to this park. Best-valued listing is
 * defined as the Airbnb that is the closest and has at least 150 user reviews.
 *
 * Expected runtime: 8s.
 *
 * @param species A common name for the species of interest.
 * @param num The number of Airbnbs to return for each park.
 * @param state The 2-letter code of the state of interest.
 * @returns The SQL query for this search.
 */
const recommendedAirbnbInStateForSpecies = (species, num, state) =>
  `WITH parks AS (SELECT DISTINCT S.park_name, P.longitude, P.latitude
               FROM Park P
                        JOIN Species S ON P.park_name = S.park_name
               WHERE common_names LIKE '%${species}%' AND state LIKE '%${state}%'),
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
                          (SELECT * FROM Airbnb WHERE state LIKE '%${state}%') A
                     GROUP BY S.park_name, S.longitude, S.latitude, A.name, A.price, A.longitude, A.latitude,
                              A.number_of_reviews, A.state, A.host_name, A.room_type, A.minimum_nights,
                              A.availability_365, A.city),
     ranked_park_airbinb AS (SELECT *,
                                    ROW_NUMBER() OVER (PARTITION BY park_name
                                        ORDER BY distance_to_park, price, number_of_reviews DESC) AS ranking
                             FROM park_airbnb)
SELECT *
FROM ranked_park_airbinb
WHERE ranking < ${num + 1}
GROUP BY name, distance_to_park, park_name, price, number_of_reviews, city, state, host_name, room_type, minimum_nights, availability_365
ORDER BY distance_to_park;`

module.exports = {
  recommendedAirbnbForSpecies,
  recommendedAirbnbInStateForSpecies
}
