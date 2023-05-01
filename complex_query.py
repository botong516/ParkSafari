# Optimized Complex Queries
# Query 1A
# For each of the national parks where a specific species can be found, get the 
# top 3 best-valued Airbnb listings that are the closest to this park. Best-valued listing is
# defined as the Airbnb that is the closest and has at least 150 user reviews.
# For example, species =seal, num = 3.
q1A=`SELECT P.*
FROM (SELECT name,
             distance_to_park,
             park_name,
             price,
             number_of_reviews,
             city,
             state,
             host_name,
             room_type,
             minimum_nights,
             availability_365,
             ranking
      FROM materialized_view_ranked_airbnb_near_park
      WHERE ranking < 10) P
WHERE park_name IN (SELECT DISTINCT park_name
                    FROM Species
                    WHERE common_names LIKE '%seal%')
ORDER BY distance_to_park, park_name, ranking;`

# Query 1B
# For each of the national parks in a specific state where a specific species can be found, get the 
# top 3 best-valued Airbnb listings that are the closest to this park. Best-valued listing is
# defined as the Airbnb that is the closest and has at least 150 user reviews.
# For example, state = CA, species =seal, num = 3. 
q1B=`SELECT name,
       distance_to_park,
       park_name,
       price,
       number_of_reviews,
       city,
       state,
       host_name,
       room_type,
       minimum_nights,
       availability_365,
       ranking
FROM (SELECT * FROM materialized_view_ranked_airbnb_near_park WHERE state LIKE '%CA%' AND ranking < 4) P
WHERE park_name IN (SELECT DISTINCT park_name
                    FROM Species
                    WHERE common_names LIKE '%seal%')
ORDER BY distance_to_park, park_name, ranking;`

# Query 2
# In a specified state and neighbourhood, get the top n Airbnbs that have the highest species
# count from parks within [x] miles of radius from it.
# For example, state = CA, neighbourhood = Hollywood, distance < 100 miles, num = 10
q2 = `WITH nearby_airbnb AS (SELECT *
                       FROM materialized_view_ranked_airbnb_near_park
                       WHERE state LIKE '%CA%'
                         AND distance_to_park < 100
                         AND neighbourhood = 'Hollywood'),
     biodiverse_airbnb AS (SELECT COUNT(S.scientific_name) AS count, A.id
                           FROM Species S
                                    JOIN nearby_airbnb A ON A.park_name = S.park_name
                           GROUP BY A.id
                           ORDER BY count DESC
                           LIMIT 10)
SELECT A1.count, A2.*
FROM biodiverse_airbnb A1
         JOIN Airbnb A2 ON A1.id = A2.id;`

