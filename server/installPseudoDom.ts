import { installGlobal } from 'pseudo-dom'

/**
 * json-dom creates its documentItem singleton at import time, which needs a real (or pseudo) `document` to
 * already exist globally - fine in a browser or under jsdom, but nothing does this for a plain Node process. This
 * file's only job is that one side effect: import it before anything that imports json-dom, so document/Node/
 * Element/HTMLElement exist by the time json-dom's own modules load. See src/main.ts's own comment about this
 * same assumption, for the browser/jsdom side where a real DOM already covers it.
 */
installGlobal()
