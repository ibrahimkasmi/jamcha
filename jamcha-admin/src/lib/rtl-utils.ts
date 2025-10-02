import i18n from './i18n';

/**
 * RTL Utility Functions for Jamcha Admin
 * Provides consistent direction handling across the application
 */

export const getRTLDirection = () => i18n.dir();

export const isRTL = () => i18n.dir() === 'rtl';

/**
 * Get direction-aware spacing classes
 */
export const getSpacingClass = (baseClass: string): string => {
  const dir = getRTLDirection();
  if (dir === 'rtl') {
    return `${baseClass} space-x-reverse`;
  }
  return baseClass;
};

/**
 * Get direction-aware margin/padding classes
 */
export const getDirectionalClass = (ltrClass: string, rtlClass: string): string => {
  return isRTL() ? rtlClass : ltrClass;
};

/**
 * Common RTL-aware class combinations
 */
export const rtlClasses = {
  // Spacing
  spaceX2: () => getSpacingClass('space-x-2'),
  spaceX3: () => getSpacingClass('space-x-3'),
  spaceX4: () => getSpacingClass('space-x-4'),
  spaceX8: () => getSpacingClass('space-x-8'),
  
  // Text alignment
  textAlign: () => isRTL() ? 'text-right' : 'text-left',
  
  // Positioning
  marginLeft: (value: string) => isRTL() ? `mr-${value}` : `ml-${value}`,
  marginRight: (value: string) => isRTL() ? `ml-${value}` : `mr-${value}`,
  paddingLeft: (value: string) => isRTL() ? `pr-${value}` : `pl-${value}`,
  paddingRight: (value: string) => isRTL() ? `pl-${value}` : `pr-${value}`,
  
  // Borders
  borderLeft: (value?: string) => isRTL() ? `border-r${value ? `-${value}` : ''}` : `border-l${value ? `-${value}` : ''}`,
  borderRight: (value?: string) => isRTL() ? `border-l${value ? `-${value}` : ''}` : `border-r${value ? `-${value}` : ''}`,
  
  // Flex direction awareness
  flexRow: () => isRTL() ? 'flex-row-reverse' : 'flex-row',
  
  // Icon positioning (for icons next to text)
  iconLeft: () => isRTL() ? 'ml-2' : 'mr-2',
  iconRight: () => isRTL() ? 'mr-2' : 'ml-2',
};

/**
 * Generate direction-aware className string
 */
export const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * RTL-aware flex container
 */
export const getRTLFlexClass = (baseClasses: string): string => {
  const dir = getRTLDirection();
  if (dir === 'rtl') {
    // Convert space-x-* classes to space-x-reverse variants
    return baseClasses.replace(/space-x-(\d+)/g, 'space-x-$1 space-x-reverse');
  }
  return baseClasses;
};

/**
 * Get direction attribute for HTML elements
 */
export const getDirectionAttr = () => ({
  dir: getRTLDirection()
});