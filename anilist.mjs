import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const search = (page = 1, perPage = 50) => ({
  query: `
  query Media($page: Int = 1, $perPage: Int = 50, $id: Int, $idMal: Int, $startDate: FuzzyDateInt, $endDate: FuzzyDateInt, $season: MediaSeason, $seasonYear: Int, $type: MediaType, $format: MediaFormat, $status: MediaStatus, $episodes: Int, $duration: Int, $chapters: Int, $volumes: Int, $isAdult: Boolean, $genre: String, $tag: String, $minimumTagRank: Int, $tagCategory: String, $onList: Boolean, $licensedBy: String, $licensedById: Int, $averageScore: Int, $popularity: Int, $source: MediaSource, $countryOfOrigin: CountryCode, $isLicensed: Boolean, $search: String, $id_not: Int, $id_in: [Int], $id_not_in: [Int], $idMal_not: Int, $idMal_in: [Int], $idMal_not_in: [Int], $startDate_greater: FuzzyDateInt, $startDate_lesser: FuzzyDateInt, $startDate_like: String, $endDate_greater: FuzzyDateInt, $endDate_lesser: FuzzyDateInt, $endDate_like: String, $format_in: [MediaFormat], $format_not: MediaFormat, $format_not_in: [MediaFormat], $status_in: [MediaStatus], $status_not: MediaStatus, $status_not_in: [MediaStatus], $episodes_greater: Int, $episodes_lesser: Int, $duration_greater: Int, $duration_lesser: Int, $chapters_greater: Int, $chapters_lesser: Int, $volumes_greater: Int, $volumes_lesser: Int, $genre_in: [String], $genre_not_in: [String], $tag_in: [String], $tag_not_in: [String], $tagCategory_in: [String], $tagCategory_not_in: [String], $licensedBy_in: [String], $licensedById_in: [Int], $averageScore_not: Int, $averageScore_greater: Int, $averageScore_lesser: Int, $popularity_not: Int, $popularity_greater: Int, $popularity_lesser: Int, $source_in: [MediaSource], $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(id: $id, idMal: $idMal, startDate: $startDate, endDate: $endDate, season: $season, seasonYear: $seasonYear, type: $type, format: $format, status: $status, episodes: $episodes, duration: $duration, chapters: $chapters, volumes: $volumes, isAdult: $isAdult, genre: $genre, tag: $tag, minimumTagRank: $minimumTagRank, tagCategory: $tagCategory, onList: $onList, licensedBy: $licensedBy, licensedById: $licensedById, averageScore: $averageScore, popularity: $popularity, source: $source, countryOfOrigin: $countryOfOrigin, isLicensed: $isLicensed, search: $search, id_not: $id_not, id_in: $id_in, id_not_in: $id_not_in, idMal_not: $idMal_not, idMal_in: $idMal_in, idMal_not_in: $idMal_not_in, startDate_greater: $startDate_greater, startDate_lesser: $startDate_lesser, startDate_like: $startDate_like, endDate_greater: $endDate_greater, endDate_lesser: $endDate_lesser, endDate_like: $endDate_like, format_in: $format_in, format_not: $format_not, format_not_in: $format_not_in, status_in: $status_in, status_not: $status_not, status_not_in: $status_not_in, episodes_greater: $episodes_greater, episodes_lesser: $episodes_lesser, duration_greater: $duration_greater, duration_lesser: $duration_lesser, chapters_greater: $chapters_greater, chapters_lesser: $chapters_lesser, volumes_greater: $volumes_greater, volumes_lesser: $volumes_lesser, genre_in: $genre_in, genre_not_in: $genre_not_in, tag_in: $tag_in, tag_not_in: $tag_not_in, tagCategory_in: $tagCategory_in, tagCategory_not_in: $tagCategory_not_in, licensedBy_in: $licensedBy_in, licensedById_in: $licensedById_in, averageScore_not: $averageScore_not, averageScore_greater: $averageScore_greater, averageScore_lesser: $averageScore_lesser, popularity_not: $popularity_not, popularity_greater: $popularity_greater, popularity_lesser: $popularity_lesser, source_in: $source_in, sort: $sort) {
        id
        type
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          color
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        bannerImage
        season
        seasonYear
        description
        type
        format
        status(version: 2)
        episodes
        duration
        chapters
        volumes
        favourites
        trending
        genres
        isAdult
        averageScore
        popularity
        trailer {
          id
          site
        }
      }
    }
  }
  `,
  variables: {
    licensedById: 45,
    page,
    perPage
    // search: '1'
    // season: 'FALL',
    // seasonYear: '2022',
    // sort: ['POPULARITY_DESC'],
    // tag_in: ["Angels"]
    // format:"MOVIE"
    // type: 'ANIME',
    // isAdult: false,

    // countryOfOrigin: "CN",
    // status: "FINISHED"
  }
})

const media = {
  query: `
  query media($id: Int = 11061, $type: MediaType = ANIME, $isAdult: Boolean = false) {
    Media(id: $id, type: $type, isAdult: $isAdult) {
      id
      title {
        userPreferred
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
      }
      bannerImage
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      description
      season
      seasonYear
      type
      format
      status(version: 2)
      episodes
      duration
      chapters
      volumes
      genres
      synonyms
      source(version: 3)
      isAdult
      isLocked
      meanScore
      averageScore
      popularity
      favourites
      isFavouriteBlocked
      hashtag
      countryOfOrigin
      isLicensed
      isFavourite
      isRecommendationBlocked
      isFavouriteBlocked
      isReviewBlocked
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      relations {
        edges {
          id
          relationType(version: 2)
          node {
            id
            title {
              userPreferred
            }
            format
            type
            status(version: 2)
            bannerImage
            coverImage {
              large
            }
          }
        }
      }
      characterPreview: characters(perPage: 6, sort: [ROLE, RELEVANCE, ID]) {
        edges {
          id
          role
          name
          voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
            id
            name {
              userPreferred
            }
            language: languageV2
            image {
              large
            }
          }
          node {
            id
            name {
              userPreferred
            }
            image {
              large
            }
          }
        }
      }
      staffPreview: staff(perPage: 8, sort: [RELEVANCE, ID]) {
        edges {
          id
          role
          node {
            id
            name {
              userPreferred
            }
            language: languageV2
            image {
              large
            }
          }
        }
      }
      studios {
        edges {
          isMain
          node {
            id
            name
          }
        }
      }
      reviewPreview: reviews(perPage: 2, sort: [RATING_DESC, ID]) {
        pageInfo {
          total
        }
        nodes {
          id
          summary
          rating
          ratingAmount
          user {
            id
            name
            avatar {
              large
            }
          }
        }
      }
      recommendations(perPage: 7, sort: [RATING_DESC, ID]) {
        pageInfo {
          total
        }
        nodes {
          id
          rating
          userRating
          mediaRecommendation {
            id
            title {
              userPreferred
            }
            format
            type
            status(version: 2)
            bannerImage
            coverImage {
              large
            }
          }
          user {
            id
            name
            avatar {
              large
            }
          }
        }
      }
      externalLinks {
        id
        site
        url
        type
        language
        color
        icon
        notes
        isDisabled
      }
      streamingEpisodes {
        site
        title
        thumbnail
        url
      }
      trailer {
        id
        site
      }
      rankings {
        id
        rank
        type
        format
        year
        season
        allTime
        context
      }
      tags {
        id
        name
        description
        rank
        isMediaSpoiler
        isGeneralSpoiler
        userId
      }
      mediaListEntry {
        id
        status
        score
      }
      stats {
        statusDistribution {
          status
          amount
        }
        scoreDistribution {
          score
          amount
        }
      }
    }
  }

  `,
  variables: { id: '11061', type: 'ANIME', isAdult: false }
}

const headers = {
  accept: 'application/json',
  'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
  'content-type': 'application/json',
  'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site'
}

const maxPage = 2000
const maxPrePage = 50
const DAY_MS = 1000 * 60 * 60 * 24
const startDay = 1672314700350

const needCountOnDay = (maxPage * maxPrePage) / 15
const countDay = needCountOnDay / maxPrePage
const startPage = Math.floor((Date.now() - startDay) / DAY_MS) + 1

console.log(`从${maxPage - startPage}页开始，${needCountOnDay}条一天`)

/**
 *
 * @param {{ operationName?: 'Media'; query: string; variables: object }} body
 * @returns {any}
 */
const fetchAni = (body) =>
  fetch('https://graphql.anilist.co/', {
    headers: headers,
    referrer: 'https://anilist.co/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: JSON.stringify(body),
    method: 'POST'
  })

for (let i = maxPage - startPage; i <= countDay; i++) {
  fetchAni(search(i))
    .then((_) => _.json())
    .then(
      ({
        data: {
          Page: { media, pageInfo }
        }
      }) => {
        console.log(pageInfo)
        console.log(media.length)
        media.forEach((m) => {
          try {
            if (fs.existsSync(path.join(path.resolve(), `animes/${m.id}.json`))) return
            fs.writeFileSync(path.join(path.resolve(), `animes/${m.id}.json`), JSON.stringify(m))
          } catch (error) {
            fs.writeFileSync(path.join(path.resolve(), `animes/_${m.id}.json`), JSON.stringify({}))
          }
        })
      }
    )
}
