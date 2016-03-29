import _ from 'lodash'
import React, { Children } from 'react'

import Icon from '../elements/Icon/Icon'
import Image from '../elements/Image/Image'

/**
 * Selects all of the props specified in pluginPropTypes
 * @param {object} props React.Component props
 * @param {object} pluginPropTypes SemanticUI related plugin props
 * @returns {object} keys are the filtered props, values are the prop values
 */
export const getPluginProps = (props, pluginPropTypes) => {
  return _.pick(props, _.keys(pluginPropTypes))
}

/**
 * Filters out all of the props specified in pluginPropTypes
 * @param {object} props React.Component props
 * @param {object} pluginPropTypes SemanticUI related plugin props
 * @returns {object} keys are the filtered props, values are the prop values
 */
export const getComponentProps = (props, pluginPropTypes) => {
  return _.omit(props, _.keys(pluginPropTypes))
}

export const customPropTypes = {
  /*
   * Ensures children are of a set of types
   * Similar to `oneOfType` built-in validator
   * @param {Array<string>} allowedTypes Collection of allowed Stardust component types
   * @returns {Array} containing children of the specified type
   */
  ofComponentTypes: (allowedTypes) => {
    return (props, propName, componentName) => {
      const { children } = props
      const disallowed = Children.map(children, child => {
        return _.includes(allowedTypes, _.get(child, 'type._meta.name')) ? null : child
      })
      if (disallowed && disallowed.length !== 0) {
        return new Error(
          `\`${componentName}\` should only have children of type \`${allowedTypes}\`.`
        )
      }
    }
  },
  /*
   * Verifies exclusivity of a given prop
   * @param {string} exclusives property used for exclusivity check
   * @throws {Error} if named prop not mutually exclusive
   * @returns no-op
   */
  mutuallyExclusive: exclusives => {
    return (props, propName, componentName) => {
      _.forEach(exclusives, exclusiveProp => {
        if (props[propName] && props[exclusiveProp]) {
          return new Error(
            `\`${componentName}\` should only have one of type \`${propName}\` or \`${exclusiveProp}\` not both.`
          )
        }
      })
    }
  },
}

// ------------------------------------
// Prop Renderers
// ------------------------------------
export const iconPropRenderer = (val) => _.isString(val) ? <Icon className={val} /> : val
export const imagePropRenderer = (val) => _.isString(val) ? <Image src={val} /> : val

// ------------------------------------
// Prop To Class Name
// ------------------------------------
export const useKeyOnly = (val, key) => val && key
export const useValueAndKey = (val, key) => val && val !== true && `${val} ${key}`
export const useKeyOrValueAndKey = (val, key) => val && (val === true ? key : `${val} ${key}`)
