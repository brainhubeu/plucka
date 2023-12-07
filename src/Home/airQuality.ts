/*
0–50	Level 1	Excellent - No health implications.	Everyone can continue their outdoor activities normally.
51–100	Level 2	Good - Some pollutants may slightly affect very few hypersensitive individuals.	Only very few hypersensitive people should reduce outdoor activities.
101–150	Level 3	Lightly Polluted - Healthy people may experience slight irritations and sensitive individuals will be slightly affected to a larger extent.	Children, seniors and individuals with respiratory or heart diseases should reduce sustained and high-intensity outdoor exercises.
151–200	Level 4	Moderately Polluted - Sensitive individuals will experience more serious conditions. The hearts and respiratory systems of healthy people may be affected.	Children, seniors and individuals with respiratory or heart diseases should avoid sustained and high-intensity outdoor exercises. General population should moderately reduce outdoor activities.
201–300	Level 5	Heavily Polluted - Healthy people will commonly show symptoms. People with respiratory or heart diseases will be significantly affected and will experience reduced endurance in activities.	Children, seniors and individuals with heart or lung diseases should stay indoors and avoid outdoor activities. General population should reduce outdoor activities.
>300	Level 6	Severely Polluted - Healthy people will experience reduced endurance in activities and may also show noticeably strong symptoms. Other illnesses may be triggered in healthy people. Elders and the sick should remain indoors and avoid exercise. Healthy individuals should avoid outdoor activities.	Children, seniors and the sick should stay indoors and avoid physical exertion. General population should avoid outdoor activities.
 */
type AQILabel = 'Excellent' | 'Good' | 'Lightly Polluted' | 'Moderately Polluted' | 'Heavily Polluted' | 'Severely Polluted';
const AQI: { from: number, to: number, label: AQILabel, explanation: string }[] = [
  { from: 0, to: 50, label: 'Excellent', explanation: 'No health implications.\tEveryone can continue their outdoor activities normally.' },
  { from: 51, to: 100, label: 'Good', explanation: 'Some pollutants may slightly affect very few hypersensitive individuals.\tOnly very few hypersensitive people should reduce outdoor activities.' },
  { from: 101, to: 150, label: 'Lightly Polluted', explanation: 'Healthy people may experience slight irritations and sensitive individuals will be slightly affected to a larger extent.\tChildren, seniors and individuals with respiratory or heart diseases should reduce sustained and high-intensity outdoor exercises.' },
  { from: 151, to: 200, label: 'Moderately Polluted', explanation: 'Sensitive individuals will experience more serious conditions. The hearts and respiratory systems of healthy people may be affected.\tChildren, seniors and individuals with respiratory or heart diseases should avoid sustained and high-intensity outdoor exercises. General population should moderately reduce outdoor activities.' },
  { from: 201, to: 300, label: 'Heavily Polluted', explanation: 'Healthy people will commonly show symptoms. People with respiratory or heart diseases will be significantly affected and will experience reduced endurance in activities.\tChildren, seniors and individuals with heart or lung diseases should stay indoors and avoid outdoor activities. General population should reduce outdoor activities.' },
  { from: 301, to: Infinity, label: 'Severely Polluted', explanation: 'Healthy people will experience reduced endurance in activities and may also show noticeably strong symptoms. Other illnesses may be triggered in healthy people. Elders and the sick should remain indoors and avoid exercise. Healthy individuals should avoid outdoor activities.\tChildren, seniors and the sick should stay indoors and avoid physical exertion. General population should avoid outdoor activities.' },
];
export const getAQI = (AQIValue?: number) => AQIValue && AQI.find(({ from, to }) => AQIValue >= from && AQIValue <= to);
export const AirQuality = {
  LUNGS: {
    'Excellent': ['very-high-0'],
    'Good': ['high-0'],
    'Lightly Polluted': ['medium-0'],
    'Moderately Polluted': ['low-0'],
    'Heavily Polluted': ['very-low-0'],
    'Severely Polluted': ['extreme-0'],
  }
};
export const getAssetUrl = (asset: string, extension = 'png') => `assets/${asset}.${extension}`;
