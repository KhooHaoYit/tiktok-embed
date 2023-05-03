
import { z } from 'zod';

export const tiktokSchema = z.object({
  AppContext: z.object({
    appContext: z.object({
      language: z.string(),
      region: z.string(),
      appId: z.number(),
      appType: z.string(),
      wid: z.string(),
      nonce: z.string(),
      botType: z.string(),
      requestId: z.string(),
      clusterRegion: z.string(),
      abTestVersion: z.object({
        versionName: z.string(),
        parameters: z.object({
          pc_video_playlist_test: z.object({
            botVid: z.string()
          }),
          video_feed_redesign: z.object({
            vid: z.string()
          }),
          mobile_search_test: z.object({
            vid: z.string()
          }),
          video_bitrate_adapt: z.object({
            vid: z.string()
          }),
          xg_volume_test: z.object({
            vid: z.string()
          }),
          share_button_part1_test: z.object({
            vid: z.string()
          }),
          mobile_vodkit: z.object({
            vid: z.string()
          }),
          studio_web_eh_entrance: z.object({
            vid: z.string()
          }),
          volume_normalize: z.object({
            vid: z.string()
          }),
          periodic_login_popup_interval: z.object({
            vid: z.string()
          }),
          photo_test: z.object({
            vid: z.string()
          }),
          has_system_notification_inbox: z.object({
            vid: z.string()
          }),
          search_video: z.object({
            vid: z.string(),
            botVid: z.string()
          }),
          video_serverpush: z.object({
            vid: z.string()
          }),
          browse_mode_autoplay_test: z.object({
            vid: z.string()
          }),
          comment_refactor_test: z.object({
            vid: z.string()
          }),
          creator_center_test: z.object({
            vid: z.string()
          }),
          enhance_video_consumption_test: z.object({
            vid: z.string()
          }),
          increase_detail_page_cover_quantity_test: z.object({
            vid: z.string()
          }),
          live_abr_version: z.object({
            vid: z.string()
          }),
          live_end_improved_metrics: z.object({
            vid: z.string()
          }),
          live_golive_entrance: z.object({
            vid: z.string()
          }),
          live_lcp_perf_optimize: z.object({
            vid: z.string()
          }),
          live_player_codetype: z.object({
            vid: z.string()
          }),
          live_room_age_restriction: z.object({
            vid: z.string()
          }),
          live_studio_download_refactor_pc: z.object({
            vid: z.string()
          }),
          live_top_viewers: z.object({
            vid: z.string()
          }),
          optimise_browser_mode: z.object({
            vid: z.string()
          }),
          pumbaa_enable_test: z.object({
            vid: z.string()
          }),
          search_video_lab: z.object({
            vid: z.string()
          }),
          translation_reduce: z.object({
            vid: z.string()
          }),
          ttlive_broadcast_topic_version_two: z.object({
            vid: z.string()
          }),
          webapp_exp: z.object({
            vid: z.string()
          }),
          webapp_recommend_language: z.object({
            vid: z.string()
          }),
          webapp_video_detail_page_related_mask: z.object({
            vid: z.string()
          }),
          xgplayer_preload_config: z.object({
            vid: z.string()
          })
        })
      }),
      csrfToken: z.string(),
      userAgent: z.string(),
      encryptedWebid: z.string(),
      host: z.string()
    }),
    initialized: z.boolean(),
    lang: z.string(),
    sideNavActive: z.boolean()
  }),
  BizContext: z.object({
    bizContext: z.object({
      os: z.string(),
      isMobile: z.boolean(),
      isAndroid: z.boolean(),
      isIOS: z.boolean(),
      jumpType: z.string(),
      navList: z.object({
        title: z.string(),
        children: z.object({
          title: z.string(),
          href: z.string()
        }).array()
      }).array(),
      config: z.object({
        featureFlags: z.object({
          feature_bar: z.boolean(),
          business_account_open: z.boolean(),
          feature_tt4b_ads: z.boolean(),
          support_multiline_desc: z.boolean()
        }),
        signUpOpen: z.boolean(),
        cookieBanner: z.object({
          load_dynamically: z.boolean(),
          decline_btn_staged_rollout_area: z.string().array(),
          resource: z.object({
            prefix: z.string(),
            themes: z.string().array(),
            esm: z.string(),
            nomodule: z.string(),
            version: z.string()
          }),
          i18n: z.object({
            cookieBannerTitle: z.string(),
            cookieBannerTitleNew: z.string(),
            cookieBannerSubTitle: z.string(),
            cookieBannerSubTitleNew: z.string(),
            cookieBannerSubTitleV2: z.string(),
            cookieBannerBtnManage: z.string(),
            cookieBannerBtnAccept: z.string(),
            cookieBannerBtnDecline: z.string(),
            cookiesBannerDetails: z.string(),
            cookiesBannerCookiesPolicy: z.string(),
            cookiesBannerAccept: z.string(),
            webDoNotSellSettingsSavedToast: z.string(),
            cookieSettingManageYourCookieTitle: z.string(),
            cookieSettingSave: z.string(),
            cookieSettingAnalyticsAndMarketing: z.string(),
            cookieSettingNecessary: z.string(),
            cookieSettingNecessarySubtitle: z.string(),
            cookieSettingNecessaryV2: z.string(),
            cookieSettingNecessarySubtitleV2: z.string(),
            cookieSettingAnalyticsAndMarketingSubtitle: z.string(),
            cookieSettingAnalyticsAndMarketingSubtitleV2: z.string(),
            cookieManageTip: z.string()
          })
        }),
        isGrayFilter: z.boolean(),
        nickNameControlDay: z.string()
      }),
      domains: z.object({
        kind: z.string(),
        captcha: z.string(),
        imApi: z.string(),
        imFrontier: z.string(),
        mTApi: z.string(),
        rootApi: z.string(),
        secSDK: z.string(),
        slardar: z.string(),
        starling: z.string(),
        tea: z.string(),
        libraWebSDK: z.string(),
        webcastApi: z.string(),
        webcastRootApi: z.string(),
        pipoApi: z.string(),
        tcc: z.string(),
        search: z.string(),
        aweme: z.string()
      }),
      downloadLink: z.object({
        microsoft: z.object({
          visible: z.boolean(),
          normal: z.string()
        }),
        apple: z.object({
          visible: z.boolean(),
          normal: z.string()
        }),
        amazon: z.object({
          visible: z.boolean(),
          normal: z.string()
        }),
        google: z.object({
          visible: z.boolean(),
          normal: z.string()
        })
      }),
      deviceLimitRegisterExpired: z.boolean(),
      subdivisions: z.string().array(),
      geo: z.string().array(),
      geoCity: z.object({
        City: z.string(),
        Subdivisions: z.string(),
        OriginalSubdivisions: z.object({
          GeoNameID: z.string(),
          ASCIName: z.string(),
          Name: z.string()
        }).array(),
        SubdivisionsArr: z.string().array()
      }),
      isGoogleBot: z.boolean(),
      isBingBot: z.boolean(),
      isBot: z.boolean(),
      isSearchEngineBot: z.boolean(),
      isTTP: z.boolean(),
      dateFmtLocale: z.object({
        name: z.string(),
        months: z.string().array(),
        monthsShort: z.string().array(),
        weekdays: z.string().array(),
        weekdaysShort: z.string().array(),
        weekdaysMin: z.string().array(),
        longDateFormat: z.object({
          LT: z.string(),
          LTS: z.string(),
          L: z.string(),
          LL: z.string(),
          LLL: z.string(),
          LLLL: z.string(),
          l: z.string(),
          ll: z.string(),
          lll: z.string(),
          llll: z.string(),
          'LL-Y': z.string()
        }),
        meridiem: z.object({
          am: z.string(),
          pm: z.string(),
          AM: z.string(),
          PM: z.string()
        })
      }),
      videoPlayerConfig: z.object({
        fallback: z.boolean()
      }),
      playbackNormalizePath: z.object({
        path: z.string().array()
      }),
      bitrateConfig: z.object({
        bitrateLower: z.number(),
        bitrateRange: z.number().array(),
        bitrateUpper: z.number(),
        mode: z.string(),
        paramBf: z.number(),
        paramBp: z.number(),
        paramLower: z.number(),
        paramUpper: z.number(),
        paramUpperBl: z.number(),
        paramVl1: z.number(),
        paramVl2: z.number(),
        paramVlLower: z.number(),
        paramVlUpper: z.number(),
        slidingWindowCountThreshold: z.number(),
        slidingWindowExtraction: z.string(),
        slidingWindowType: z.string(),
        slidingWindowWeight: z.string(),
        slidingWindowWeightThreshold: z.number()
      }),
      searchVideoForLoggedin: z.boolean(),
      studioDownloadEntrance: z.object({
        regions: z.string().array(),
        userRegions: z.string().array(),
        allRegions: z.boolean()
      }),
      liveSuggestConfig: z.object({
        isBlockedArea: z.boolean(),
        isRiskArea: z.boolean()
      }),
      liveAnchorEntrance: z.object({
        liveCenter: z.boolean(),
        creatorHub: z.boolean(),
        liveStudio: z.boolean()
      }),
      liveStudioEnable: z.boolean(),
      xgplayerInitHost: z.object({
        group1: z.string().array(),
        group2: z.string().array()
      }),
      videoOrder: z.object({
        videoOrder: z.union([
          z.object({
            property: z.string(),
            detail: z.number().array()
          }),
          z.object({
            property: z.string(),
            order: z.string()
          })
        ]).array()
      }),
      searchLiveForLoggedin: z.boolean()
    }),
    initialized: z.boolean()
  }),
  SEOState: z.object({
    metaParams: z.object({
      title: z.string(),
      keywords: z.string(),
      description: z.string(),
      canonicalHref: z.string(),
      robotsContent: z.string(),
      applicableDevice: z.string()
    }),
    jsonldList: z.union([
      z.union([
        z.string(),
        z.object({
          itemListElement: z.object({
            '@type': z.string(),
            position: z.number(),
            item: z.object({
              '@type': z.string(),
              '@id': z.string(),
              name: z.string()
            })
          }).array()
        })
      ]).array(),
      z.union([
        z.string(),
        z.object({

        })
      ]).array()
    ]).array(),
    abtest: z.object({
      pageId: z.string(),
      vidList: z.tuple([]),
      parameters: z.object({
        video_page_serp_compliance: z.object({
          vid: z.string()
        })
      })
    }),
    loading: z.boolean(),
    canonical: z.string(),
    pageType: z.number(),
    launchMode: z.string(),
    trafficType: z.string()
  }),
  SharingMeta: z.object({
    value: z.object({
      'al:ios:url': z.string(),
      'al:android:url': z.string(),
      'al:ios:app_store_id': z.string(),
      'al:ios:app_name': z.string(),
      'al:android:app_name': z.string(),
      'al:android:package': z.string(),
      'og:site_name': z.string(),
      'og:type': z.string(),
      'og:title': z.string(),
      'og:description': z.string(),
      'fb:app_id': z.string(),
      'twitter:app:id:iphone': z.string(),
      'twitter:app:id:googleplay': z.string(),
      'twitter:card': z.string(),
      'twitter:site': z.string(),
      'twitter:title': z.string(),
      'twitter:description': z.string(),
      'og:image': z.string(),
      'twitter:image': z.string(),
      'og:image:width': z.string(),
      'og:image:height': z.string()
    })
  }),
  ItemList: z.object({
    video: z.object({
      list: z.string().array(),
      browserList: z.string().array(),
      loading: z.boolean(),
      statusCode: z.number(),
      hasMore: z.boolean(),
      cursor: z.string(),
      preloadList: z.object({
        url: z.string(),
        id: z.string()
      }).array(),
      keyword: z.string()
    })
  }),
  ItemModule: z.object({
    7212396482194918662: z.object({
      id: z.string(),
      desc: z.string(),
      createTime: z.string(),
      scheduleTime: z.number(),
      video: z.object({
        id: z.string(),
        height: z.number(),
        width: z.number(),
        duration: z.number(),
        ratio: z.string(),
        cover: z.string(),
        originCover: z.string(),
        dynamicCover: z.string(),
        playAddr: z.string(),
        downloadAddr: z.string(),
        shareCover: z.string().array(),
        reflowCover: z.string(),
        bitrate: z.number(),
        encodedType: z.string(),
        format: z.string(),
        videoQuality: z.string(),
        encodeUserTag: z.string(),
        codecType: z.string(),
        definition: z.string(),
        subtitleInfos: z.tuple([]),
        zoomCover: z.object({
          240: z.string(),
          480: z.string(),
          720: z.string(),
          960: z.string()
        }),
        volumeInfo: z.object({
          Loudness: z.number(),
          Peak: z.number()
        }),
        bitrateInfo: z.object({
          GearName: z.string(),
          Bitrate: z.number(),
          QualityType: z.number(),
          PlayAddr: z.object({
            Uri: z.string(),
            UrlList: z.string().array(),
            DataSize: z.string(),
            UrlKey: z.string(),
            FileHash: z.string(),
            FileCs: z.string()
          }),
          CodecType: z.string()
        }).array()
      }),
      author: z.string(),
      music: z.object({
        id: z.string(),
        title: z.string(),
        playUrl: z.string(),
        coverLarge: z.string(),
        coverMedium: z.string(),
        coverThumb: z.string(),
        authorName: z.string(),
        original: z.boolean(),
        duration: z.number(),
        scheduleSearchTime: z.number()
      }),
      challenges: z.object({
        id: z.string(),
        title: z.string(),
        desc: z.string(),
        profileLarger: z.string(),
        profileMedium: z.string(),
        profileThumb: z.string(),
        coverLarger: z.string(),
        coverMedium: z.string(),
        coverThumb: z.string()
      }).array(),
      stats: z.object({
        diggCount: z.number(),
        shareCount: z.number(),
        commentCount: z.number(),
        playCount: z.number()
      }),
      warnInfo: z.tuple([]),
      originalItem: z.boolean(),
      officalItem: z.boolean(),
      textExtra: z.object({
        awemeId: z.string(),
        start: z.number(),
        end: z.number(),
        hashtagId: z.string(),
        hashtagName: z.string(),
        type: z.number(),
        subType: z.number(),
        isCommerce: z.boolean()
      }).array(),
      secret: z.boolean(),
      forFriend: z.boolean(),
      digged: z.boolean(),
      itemCommentStatus: z.number(),
      takeDown: z.number(),
      effectStickers: z.tuple([]),
      privateItem: z.boolean(),
      duetEnabled: z.boolean(),
      stickersOnItem: z.tuple([]),
      shareEnabled: z.boolean(),
      comments: z.tuple([]),
      duetDisplay: z.number(),
      stitchDisplay: z.number(),
      indexEnabled: z.boolean(),
      locationCreated: z.string(),
      suggestedWords: z.tuple([]),
      contents: z.object({
        desc: z.string(),
        textExtra: z.object({
          awemeId: z.string(),
          start: z.number(),
          end: z.number(),
          hashtagId: z.string(),
          hashtagName: z.string(),
          type: z.number(),
          subType: z.number(),
          isCommerce: z.boolean()
        }).array()
      }).array(),
      nickname: z.string(),
      authorId: z.string(),
      authorSecId: z.string(),
      avatarThumb: z.string(),
      downloadSetting: z.number(),
      authorPrivate: z.boolean()
    })
  }),
  UserModule: z.object({
    users: z.object({
      hanabenouirane: z.object({
        id: z.string(),
        shortId: z.string(),
        uniqueId: z.string(),
        nickname: z.string(),
        avatarLarger: z.string(),
        avatarMedium: z.string(),
        avatarThumb: z.string(),
        signature: z.string(),
        createTime: z.number(),
        verified: z.boolean(),
        secUid: z.string(),
        ftc: z.boolean(),
        relation: z.number(),
        openFavorite: z.boolean(),
        commentSetting: z.number(),
        duetSetting: z.number(),
        stitchSetting: z.number(),
        privateAccount: z.boolean(),
        secret: z.boolean(),
        isADVirtual: z.boolean(),
        roomId: z.string(),
        uniqueIdModifyTime: z.number(),
        ttSeller: z.boolean(),
        downloadSetting: z.number(),
        recommendReason: z.string(),
        nowInvitationCardUrl: z.string(),
        nickNameModifyTime: z.number(),
        isEmbedBanned: z.boolean(),
        canExpPlaylist: z.boolean()
      })
    }),
    stats: z.object({})
  }),
  VideoPage: z.object({
    statusCode: z.number()
  })
});
