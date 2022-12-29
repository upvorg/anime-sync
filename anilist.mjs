import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const search = (page = 1, perPage = 50) => ({
  query: `
  query ($page: Int = 1, $id: Int, $type: MediaType, $isAdult: Boolean = false, $search: String, $format: [MediaFormat], $status: MediaStatus, $countryOfOrigin: CountryCode, $source: MediaSource, $season: MediaSeason, $seasonYear: Int, $year: String, $onList: Boolean, $yearLesser: FuzzyDateInt, $yearGreater: FuzzyDateInt, $episodeLesser: Int, $episodeGreater: Int, $durationLesser: Int, $durationGreater: Int, $chapterLesser: Int, $chapterGreater: Int, $volumeLesser: Int, $volumeGreater: Int, $licensedBy: [Int] = [45], $isLicensed: Boolean, $genres: [String], $excludedGenres: [String], $tags: [String], $excludedTags: [String], $minimumTagRank: Int, $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
    Page(page: $page, perPage: 20) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(id: $id, type: $type, season: $season, format_in: $format, status: $status, countryOfOrigin: $countryOfOrigin, source: $source, search: $search, onList: $onList, seasonYear: $seasonYear, startDate_like: $year, startDate_lesser: $yearLesser, startDate_greater: $yearGreater, episodes_lesser: $episodeLesser, episodes_greater: $episodeGreater, duration_lesser: $durationLesser, duration_greater: $durationGreater, chapters_lesser: $chapterLesser, chapters_greater: $chapterGreater, volumes_lesser: $volumeLesser, volumes_greater: $volumeGreater, licensedById_in: $licensedBy, isLicensed: $isLicensed, genre_in: $genres, genre_not_in: $excludedGenres, tag_in: $tags, tag_not_in: $excludedTags, minimumTagRank: $minimumTagRank, sort: $sort, isAdult: $isAdult) {
        id
        title {
          romaji
          english
          native
          userPreferred
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
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        mediaListEntry {
          id
          status
        }
        studios(isMain: true) {
          edges {
            isMain
            node {
              id
              name
            }
          }
        }
      }
    }
  }
  `,
  variables: {
    page,
    perPage,
    licensedBy: ['45'],
    type: 'ANIME'
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

function resolve(i) {
  return fetchAni(search(i))
    .then((_) => _.json())
    .then(
      ({
        data: {
          Page: { media, pageInfo }
        }
      }) => {
        console.log('pageInfo', pageInfo)
        console.log('media', media.length)
        media.forEach((m) => {
          try {
            if (fs.existsSync(path.join(path.resolve(), `animes/${m.id}.json`))) return
            fs.writeFileSync(path.join(path.resolve(), `animes/${m.id}.json`), JSON.stringify(m))
          } catch (error) {
            fs.writeFileSync(path.join(path.resolve(), `animes/_${m.id}.json`), JSON.stringify({}))
          }
        })
        if (pageInfo.hasNextPage) resolve(i + 1)
      }
    )
}

resolve(1)
