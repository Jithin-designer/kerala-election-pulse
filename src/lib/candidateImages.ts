/**
 * Manual map of candidate images available in /public/candidates/.
 * Key: "CONSTITUENCY_NAME|CANDIDATE_NAME" (uppercased, trimmed).
 * Value: filename in /public/candidates/.
 */
const IMAGE_MAP: Record<string, string> = {
  "ADOOR|ADV. PANDALAM PRATHAPAN": "ADOOR_SC_ADV_PANDALAM_PRATHAPAN.jpg",
  "AROOR|ADV. P. S. JYOTHIS": "AROOR_ADV_PS_JYOTHIS.jpg",
  "BEYPORE|ADV. PRAKASHBABU": "BEYPORE_ADV_PRAKASHBABU.jpg",
  "DHARMADOM|ABDUL RASHEED": "DHARMADOM_ABDUL_RASHEED.jpg",
  "DHARMADOM|K. RANJITH": "DHARMADOM_K_RANJITH.jpg",
  "KUNNAMANGALAM|ADV. P. T. A. RAHIM": "KUNNAMANGALAM_ADV_P_T_A_RAHIM.jpg",
  "KUNNATHUNAD|ADV. P. V. SREENIJIN": "KUNNATHUNAD_SC_ADV_P_V_SREENIJIN.jpg",
  "MANJERI|ADV. P. P. A. SAGEER": "MANJERI_ADV_PPA_SAGEER.jpg",
  "MANJESHWARA|K. SURENDRAN": "MANJESHWARA_K_SURENDRAN.jpg",
  "NEMOM|K. MURALEEDHARAN": "NEMOM_K_MURALEEDHARAN.jpg",
  "PATTAMBI|ADV. P. MANOJ": "PATTAMBI_ADV_P_MANOJ.png",
  "PERUMBAVOOR|ADV. PRASANTH": "PERUMBAVOOR_ADV_PRASANTH.jpg",
  "RANNI|ADV. PAZHAKULAM MADHU": "RANNI_ADV_PAZHAKULAM_MADHU.jpg",
  "RANNI|ADV. PRAMOD NARAYAN": "RANNI_ADV_PRAMOD_NARAYAN.jpg",
};

/**
 * Returns a photo URL for a candidate.
 * Checks the manual image map first, falls back to ui-avatars.
 */
export function getCandidatePhoto(
  candidateName: string,
  constituencyName: string,
  allianceColor: string
): { src: string; isReal: boolean } {
  const key = `${constituencyName.toUpperCase()}|${candidateName.toUpperCase()}`;

  // Check exact match
  if (IMAGE_MAP[key]) {
    return { src: `/candidates/${IMAGE_MAP[key]}`, isReal: true };
  }

  // Check partial match (candidate name might be slightly different in JSON)
  for (const [mapKey, filename] of Object.entries(IMAGE_MAP)) {
    const [mapConst, mapName] = mapKey.split("|");
    if (
      mapConst === constituencyName.toUpperCase() &&
      (candidateName.toUpperCase().includes(mapName) ||
        mapName.includes(candidateName.toUpperCase()))
    ) {
      return { src: `/candidates/${filename}`, isReal: true };
    }
  }

  // Fallback to avatar
  const bg = allianceColor.replace("#", "");
  return {
    src: `https://ui-avatars.com/api/?name=${encodeURIComponent(candidateName)}&size=400&background=${bg}&color=fff&bold=true&format=png`,
    isReal: false,
  };
}
