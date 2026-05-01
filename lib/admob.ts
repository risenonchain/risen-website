import { AdMob, RewardAdOptions } from '@capacitor-community/admob';

export async function initializeAdMob() {
  try {
    await AdMob.initialize();
  } catch (e) {
    console.error("AdMob initialization failed", e);
  }
}

export async function showRewardedAd(): Promise<any> {
  let adUnitId = process.env.NEXT_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID;

  // GOOGLE OFFICIAL REWARDED TEST ID - Use this for debugging
  const isTesting = true;
  if (isTesting) {
    adUnitId = "ca-app-pub-3940256099942544/5224354917";
  }

  if (!adUnitId) {
    throw new Error("Ad Unit ID not found");
  }

  try {
    await AdMob.prepareRewardVideoAd({
      adId: adUnitId,
    });
    const reward = await AdMob.showRewardVideoAd();
    return reward;
  } catch (e) {
    console.error("Rewarded ad failed", e);
    throw e;
  }
}
