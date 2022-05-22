import { useEffect } from 'react'
import { isEqual } from 'lodash'

export const useDeepEffect = (effect: () => void, dependencies: any[]) => {
  useEffect(() => {
    if (!isEqual(dependencies, dependencies)) {
      effect()
    }
  }, dependencies)
}
