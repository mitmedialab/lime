module.exports.connectionString = process.env.DATABASE_URL || undefined;

module.exports.githubClientId = process.env.GITHUB_KEY ? process.env.GITHUB_KEY.trim() : undefined;
module.exports.githubClientSecret = process.env.GITHUB_SECRET ? process.env.GITHUB_SECRET.trim() : undefined;

module.exports.gitterClientId = process.env.GITTER_KEY ? process.env.GITTER_KEY.trim() : undefined;
module.exports.gitterClientSecret = process.env.GITTER_SECRET ? process.env.GITTER_SECRET.trim() : undefined;

module.exports.homepageUri = undefined;