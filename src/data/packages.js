// Single source of truth for all package data is src/data/packages.json,
// which is edited via the local /admin panel (see admin-server/).
// Image fields are URL strings served from public/uploads/.

import packages from './packages.json'

export { packages }
export default packages
