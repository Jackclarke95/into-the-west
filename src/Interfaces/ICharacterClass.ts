/** Interface representing a D&D Character Class and Level */
export default interface ICharacterClass {
  /** The name of the Class */
  className: string;

  /** The level of the Class */
  level: number;

  /** The archetype of the Class */
  archetype: string | null;
}
