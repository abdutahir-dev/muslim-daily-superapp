"use strict";
/**
 * Muslim Daily SuperApp - Cloud Functions v2 (Serverless BaaS)
 *
 * Encapsulates backend business logic, automated user document initialization,
 * and high-precision financial/religious calculations offloaded from the client.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailySpiritualDigest = exports.onUserProfileCreated = exports.calculateZakatSummary = exports.db = void 0;
const admin = require("firebase-admin");
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
// Initialize Firebase Admin SDK once in serverless context
if (admin.apps.length === 0) {
    admin.initializeApp();
}
exports.db = admin.firestore();
/**
 * Callable Cloud Function: calculateZakatSummary
 *
 * Executes server-authoritative Zakat calculations according to the classical
 * 2.5% (1/40) lunar standard. Validates client inputs to prevent floating point inaccuracies
 * and enforces strict Sharia liability offsets.
 */
exports.calculateZakatSummary = (0, https_1.onCall)({ cors: true }, async (request) => {
    const data = request.data;
    // Validate non-negative numbers
    const numericFields = [
        data.cashInHand,
        data.bankSavings,
        data.goldGrams,
        data.goldPricePerGram,
        data.silverGrams,
        data.silverPricePerGram,
        data.businessInventory,
        data.debtsOwedToUser,
        data.immediateDebtsDue,
    ];
    for (const val of numericFields) {
        if (typeof val !== "number" || isNaN(val) || val < 0) {
            throw new https_1.HttpsError("invalid-argument", "All asset and liability values must be non-negative numbers.");
        }
    }
    const goldValue = data.goldGrams * data.goldPricePerGram;
    const silverValue = data.silverGrams * data.silverPricePerGram;
    const totalGrossAssets = data.cashInHand +
        data.bankSavings +
        goldValue +
        silverValue +
        data.businessInventory +
        data.debtsOwedToUser;
    const netZakatableWealth = Math.max(0, totalGrossAssets - data.immediateDebtsDue);
    // Standard Nisab: 85g gold or 595g silver
    const nisabThreshold = data.selectedNisabBasis === "silver"
        ? 595 * data.silverPricePerGram
        : 85 * data.goldPricePerGram;
    const isEligible = netZakatableWealth >= nisabThreshold && nisabThreshold > 0;
    const zakatDue = isEligible ? Math.round(netZakatableWealth * 0.025 * 100) / 100 : 0;
    return {
        totalGrossAssets: Math.round(totalGrossAssets * 100) / 100,
        netZakatableWealth: Math.round(netZakatableWealth * 100) / 100,
        nisabThreshold: Math.round(nisabThreshold * 100) / 100,
        isEligible,
        zakatDue,
        currency: "USD",
        calculatedAt: new Date().toISOString(),
    };
});
/**
 * Cloud Firestore Trigger: onUserProfileCreated
 *
 * Automatically provisions default subcollections and baseline user preference structure
 * upon new user record generation in Firestore.
 */
exports.onUserProfileCreated = (0, firestore_1.onDocumentCreated)("users/{userId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot)
        return;
    const userId = event.params.userId;
    const userData = snapshot.data();
    // Ensure audit timestamps and defaults exist
    if (!userData.createdAt) {
        await snapshot.ref.set({
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            role: "user",
            preferences: {
                theme: "light",
                timeFormat24h: false,
                notificationsEnabled: true,
                fajrWakeupOffsetMinutes: 20,
                quranReadingStyle: "hafs",
                quranTranslation: "amharic",
                dailyGoalQuranPages: 4,
                dailyGoalTasbihCount: 100,
            },
        }, { merge: true });
        console.log(`Initialized default preferences and audit logs for user ${userId}`);
    }
});
/**
 * Callable Cloud Function: getDailySpiritualDigest
 *
 * Returns curated daily Ayah, Hadith, and Islamic calendar context.
 */
exports.getDailySpiritualDigest = (0, https_1.onCall)({ cors: true }, async () => {
    return {
        date: new Date().toISOString().split("T")[0],
        ayahOfDay: {
            surahNumber: 2,
            ayahNumber: 152,
            arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
            translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
            surahName: "Al-Baqarah",
        },
        hadithOfDay: {
            narrator: "Abu Hurairah (RA)",
            text: "The Prophet (ﷺ) said: 'Take up good deeds only as much as you are able, for the best deeds are those done regularly even if they are few.'",
            source: "Sahih al-Bukhari (6465)",
        },
        spiritualFocus: "Consistency in small voluntary acts of devotion (Istiqamah).",
    };
});
//# sourceMappingURL=index.js.map