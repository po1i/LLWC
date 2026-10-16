// Fig. 1 content. Fact-checked by three independent reviewers (physics,
// pedagogy, editorial), merged, then re-verified. *word* marks a term
// introduced at that level. [eq] and [cite] are rendered by Demo.astro.

export interface Level {
  n: number;
  label: string;
  paragraphs: string[];
  assumes: string;
  added: string;
  caption: string;
  figureDesc: string;
}

export const question = 'Why does Earth have seasons?';

export const levels: Level[] = [
  {
    n: 1,
    label: 'Child',
    paragraphs: [
      'Earth is tipped a little, like a pencil held on a slant. As it travels around the Sun each year, it keeps leaning the same way.',
      'For part of the year, your half of Earth leans toward the Sun. The Sun climbs higher, shines on you more directly, and stays up longer. That is summer. Later your half leans away, and it is winter.',
    ],
    assumes: 'Earth is a ball that spins and goes around the Sun once a year.',
    added: 'Earth leans, and leaning toward the Sun means summer.',
    caption: 'Earth at the two solstices, its axis tilted the same way in both. Schematic, not to scale.',
    figureDesc:
      'The Sun in the centre with Earth on either side, at the June solstice and the December solstice. In both positions the axis is tilted by the same amount in the same direction, so in June the northern half leans toward the Sun and in December it leans away.',
  },
  {
    n: 2,
    label: 'Newcomer',
    paragraphs: [
      'Many people think summer comes when Earth is closest to the Sun. In fact Earth is closest in early January, during northern winter. Seasons come from *tilt*.',
      'Earth’s axis leans about 23.4° from upright, relative to its orbit, and points the same direction in space all year. When your *hemisphere*, your half of the globe, leans toward the Sun, it gets only a few thousand kilometres closer, out of 150 million. What changes is how high the Sun climbs and how long it stays up.',
    ],
    assumes: 'Level 1, plus what an axis is and degrees as a measure of angle.',
    added: 'Tilt as the cause, with the distance belief corrected.',
    caption: 'The orbit is really almost a perfect circle; here it is seen at a slant. Schematic, not to scale.',
    figureDesc:
      'Earth’s orbit is added, seen at a slant, with the Sun very slightly off-centre toward the January side. The January point is labelled nearest, early January, 147.1 million kilometres. The July point is labelled farthest, early July, 152.1 million kilometres.',
  },
  {
    n: 3,
    label: 'Student',
    paragraphs: [
      'Two effects work together. First, angle. A low beam of sunlight spreads over more ground, so each square metre gets less. Above the air, energy per square metre scales with the sine of the Sun’s *elevation*, its angle above the horizon.',
      'Second, duration. Tilt changes how many hours of daylight you get: at 50°N, about 16 at midsummer and about 8 at midwinter. As Earth orbits, the hemisphere tilted toward the Sun switches from north to south, so their seasons are opposite.',
    ],
    assumes: 'Latitude, angles above the horizon, and what a sine is.',
    added: 'Why a low Sun heats less, and daylight in real hours.',
    caption: 'Two equal beams of sunlight at 50°N: steep in June, low in December. Schematic, not to scale.',
    figureDesc:
      'Two panels are added below the orbit. In June an equal-width sunbeam arrives steeply and lights a small patch of ground, with about 16 hours of daylight at 50 degrees north. In December the same beam arrives low and spreads over a much larger patch, with about 8 hours of daylight.',
  },
  {
    n: 4,
    label: 'Graduate',
    paragraphs: [
      'Daily-mean *insolation*, sunlight per square metre at the top of the atmosphere, depends on latitude φ and the Sun’s *declination* δ, its angle north or south of the equator. δ ranges over ±23.44° each year.',
      '[eq]',
      'The sunrise hour angle h₀ is in radians; in polar day, h₀ = π. At the June solstice the North Pole receives more than the equator: about 525 against 385 W/m². Eccentricity (e ≈ 0.0167) makes sunlight about 7% stronger at perihelion than at aphelion: real, but secondary to tilt.',
    ],
    assumes: 'Trigonometry, radians, and averaging over a day.',
    added: 'The formula behind both effects, and its surprise: at midsummer the pole gets more than the equator.',
    caption: 'φ is measured from the equatorial plane to the observer, δ from the equatorial plane to the sunbeam. Schematic, not to scale.',
    figureDesc:
      'On the June Earth, two angles are marked at its centre. Phi, the latitude, runs from the equatorial plane to the radius pointing at an observer. Delta, the declination, runs from the equatorial plane to the incoming sunbeam, and equals the axial tilt of 23.44 degrees at the June solstice.',
  },
  {
    n: 5,
    label: 'Expert',
    paragraphs: [
      'Stored heat, mostly in the ocean’s mixed layer, delays peak temperatures: about a month over land, about two months at sea (*thermal lag*). Today perihelion falls in southern summer, so the south’s sunlight peaks about 7% above the north’s. But Kepler’s second law makes that half-year about a week shorter. The two cancel exactly: both summer half-years receive equal total insolation.',
      'Over tens to hundreds of millennia, obliquity (22.1–24.5°, ~41 kyr), climatic precession (~19–23 kyr) and eccentricity (~100 kyr) reshape seasonal contrast. These *Milankovitch cycles* pace the ice ages.[cite]',
    ],
    assumes: 'Heat capacity, Kepler’s laws, and orbital elements.',
    added: 'Thermal lag, why the perihelion boost cancels out, and how orbital cycles reshape the seasons.',
    caption: 'At northern mid-latitudes, temperature peaks after sunlight does: about a month later over land, two at sea. Schematic, not data.',
    figureDesc:
      'A strip chart over one year is added below. A solid curve shows insolation peaking at the June solstice. A land temperature curve peaks about one month later, and a dashed ocean temperature curve about two months later.',
  },
];

export const equation = {
  spoken:
    'Q bar equals S nought over pi, times the square of d bar over d, times the quantity h nought sine phi sine delta, plus cosine phi cosine delta sine h nought. Where cosine h nought equals minus tangent phi tangent delta.',
  symbols: [
    ['Q̄', 'daily-mean insolation at the top of the atmosphere, W/m²'],
    ['S₀', 'solar constant, about 1361 W/m²'],
    ['d̄, d', 'semi-major axis (1 AU) and that day’s Earth–Sun distance'],
    ['φ, δ', 'latitude, solar declination'],
    ['h₀', 'sunrise hour angle, in radians'],
  ] as const,
};

export const citation = {
  text: 'Hays, J. D., Imbrie, J. & Shackleton, N. J. (1976). Variations in the Earth’s orbit: pacemaker of the ice ages. Science 194, 1121–1132.',
  url: 'https://doi.org/10.1126/science.194.4270.1121',
};
