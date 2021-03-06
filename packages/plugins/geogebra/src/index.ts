import {
  EditorPlugin,
  EditorPluginProps,
  string,
  StringStateType
} from '@edtr-io/plugin'

import { GeogebraEditor } from './editor'

/**
 * @param config - {@link GeogebraConfig | Plugin configuration}
 * @public
 */
export function createGeogebraPlugin(
  config: GeogebraConfig = {}
): EditorPlugin<GeogebraPluginState, GeogebraPluginConfig> {
  const { i18n = {} } = config

  return {
    Component: GeogebraEditor,
    config: {
      i18n: {
        label: 'GeoGebra URL or ID',
        placeholder: '12345',
        ...i18n
      }
    },
    state: string(),
    onPaste(clipboardData: DataTransfer) {
      const value = clipboardData.getData('text')

      if (/geogebra\.org\/m\/(.+)/.test(value)) {
        return { state: value }
      }
    }
  }
}

/** @public */
export interface GeogebraConfig {
  i18n?: Partial<GeogebraPluginConfig['i18n']>
}

/** @public */
export type GeogebraPluginState = StringStateType

/** @public */
export interface GeogebraPluginConfig {
  i18n: {
    label: string
    placeholder: string
  }
}

/** @public */
export type GeogebraProps = EditorPluginProps<
  GeogebraPluginState,
  GeogebraPluginConfig
>
