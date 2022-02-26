import * as React from "react";
import { useSelector } from "react-redux";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
import {
  IPersonaProps,
  Persona,
  PersonaSize,
} from "@fluentui/react/lib/Persona";
import {
  IBasePickerSuggestionsProps,
  CompactPeoplePicker,
  ValidationState,
} from "@fluentui/react/lib/Pickers";

const suggestionProps: IBasePickerSuggestionsProps = {
  noResultsFoundText: "No results found",
  loadingText: "Loading",
};

export const CharacterPicker: React.FunctionComponent<{
  setSelectedCharacterIds: (characterIds: number[]) => void;
}> = ({ setSelectedCharacterIds }) => {
  const characters = useSelector((state) => state.characters).map(
    (character) => ({
      imageUrl: undefined,
      key: character.id,
      optionalText: character.ordinalLevel,
      text: character.name,
    })
  );

  const onFilterChanged = (
    filterText: string,
    currentPersonas?: IPersonaProps[],
    limitResults?: number
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    if (filterText) {
      let filteredPersonas: IPersonaProps[] = filterPersonasByText(filterText);

      filteredPersonas = removeDuplicates(filteredPersonas, currentPersonas!);
      filteredPersonas = limitResults
        ? filteredPersonas.slice(0, limitResults)
        : filteredPersonas;
      return filterPromise(filteredPersonas);
    } else {
      return [];
    }
  };

  const filterPersonasByText = (filterText: string): IPersonaProps[] => {
    return characters.filter((item) =>
      item.text!.toLowerCase().includes(filterText.toLowerCase())
    );
  };

  const filterPromise = (
    personasToReturn: IPersonaProps[]
  ): IPersonaProps[] => {
    return personasToReturn;
  };

  const onEmptyInpusFocus = (
    currentPersonas?: IPersonaProps[]
  ): IPersonaProps[] => {
    return filterPromise(removeDuplicates(characters, currentPersonas!));
  };

  return (
    <CompactPeoplePicker
      // eslint-disable-next-line react/jsx-no-bind
      onResolveSuggestions={onFilterChanged}
      // eslint-disable-next-line react/jsx-no-bind
      onEmptyResolveSuggestions={onEmptyInpusFocus}
      pickerSuggestionsProps={suggestionProps}
      key={"normal"}
      // eslint-disable-next-line react/jsx-no-bind
      onChange={(e) =>
        setSelectedCharacterIds(e!.map((item) => item.key as number))
      }
    />
  );
};

function removeDuplicates(
  personas: IPersonaProps[],
  possibleDupes: IPersonaProps[]
) {
  return personas.filter(
    (persona) => !listContainsPersona(persona, possibleDupes)
  );
}

function listContainsPersona(
  persona: IPersonaProps,
  personas: IPersonaProps[]
) {
  if (!personas || !personas.length || personas.length === 0) {
    return false;
  }
  return personas.filter((item) => item.text === persona.text).length > 0;
}
