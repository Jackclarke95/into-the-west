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
  NormalPeoplePicker,
  ValidationState,
} from "@fluentui/react/lib/Pickers";
import { CharacterPersona } from "./CharacterPersona";

const suggestionProps: IBasePickerSuggestionsProps = {
  noResultsFoundText: "No results found",
  loadingText: "Loading",
  showRemoveButtons: true,
};

export const CharacterPicker: React.FunctionComponent = () => {
  const characters = useSelector((state) => state.characters);

  const characterProps = characters.map((character, index) => {
    var foo = (
      <CharacterPersona
        character={character}
        characterImage={undefined}
        size={PersonaSize.size24}
      />
    );

    var bar = {
      imageInitials: "PV",
      imageUrl: undefined,
      isValid: true,
      key: index,
      optionalText: character.ordinalLevel,
      presence: 2,
      secondaryText: character.classes
        .map((characterClass) => characterClass.class)
        .join(", "),
      tertiaryText: character.level.toString(),
      text: character.name,
    };

    return bar;
  });
  const [delayResults, setDelayResults] = React.useState(false);
  const [isPickerDisabled, setIsPickerDisabled] = React.useState(false);
  const [mostRecentlyUsed, setMostRecentlyUsed] =
    React.useState<IPersonaProps[]>(characterProps);
  const [peopleList, setPeopleList] =
    React.useState<IPersonaProps[]>(characterProps);

  const picker = React.useRef(null);

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
    return peopleList.filter((item) =>
      doesTextStartWith(item.text as string, filterText)
    );
  };

  const filterPromise = (
    personasToReturn: IPersonaProps[]
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    if (delayResults) {
      return convertResultsToPromise(personasToReturn);
    } else {
      return personasToReturn;
    }
  };

  const returnMostRecentlyUsed = (
    currentPersonas?: IPersonaProps[]
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    return filterPromise(removeDuplicates(mostRecentlyUsed, currentPersonas!));
  };

  const onRemoveSuggestion = (item: IPersonaProps): void => {
    const indexPeopleList: number = peopleList.indexOf(item);
    const indexMostRecentlyUsed: number = mostRecentlyUsed.indexOf(item);

    if (indexPeopleList >= 0) {
      const newPeople: IPersonaProps[] = peopleList
        .slice(0, indexPeopleList)
        .concat(peopleList.slice(indexPeopleList + 1));
      setPeopleList(newPeople);
    }

    if (indexMostRecentlyUsed >= 0) {
      const newSuggestedPeople: IPersonaProps[] = mostRecentlyUsed
        .slice(0, indexMostRecentlyUsed)
        .concat(mostRecentlyUsed.slice(indexMostRecentlyUsed + 1));
      setMostRecentlyUsed(newSuggestedPeople);
    }
  };

  const onDisabledButtonClick = (): void => {
    setIsPickerDisabled(!isPickerDisabled);
  };

  const onToggleDelayResultsChange = (): void => {
    setDelayResults(!delayResults);
  };

  console.log(characterProps[0]);

  return (
    <NormalPeoplePicker
      // eslint-disable-next-line react/jsx-no-bind
      onResolveSuggestions={onFilterChanged}
      // eslint-disable-next-line react/jsx-no-bind
      onEmptyInputFocus={returnMostRecentlyUsed}
      getTextFromItem={getTextFromItem}
      pickerSuggestionsProps={suggestionProps}
      className={"ms-PeoplePicker"}
      key={"normal"}
      // eslint-disable-next-line react/jsx-no-bind
      onRemoveSuggestion={onRemoveSuggestion}
      onValidateInput={validateInput}
      selectionAriaLabel={"Selected contacts"}
      removeButtonAriaLabel={"Remove"}
      inputProps={{
        onBlur: (ev: React.FocusEvent<HTMLInputElement>) =>
          console.log("onBlur called"),
        onFocus: (ev: React.FocusEvent<HTMLInputElement>) =>
          console.log("onFocus called"),
        "aria-label": "People Picker",
      }}
      componentRef={picker}
      onInputChange={onInputChange}
      resolveDelay={0}
      disabled={isPickerDisabled}
    />
  );
};

function doesTextStartWith(text: string, filterText: string): boolean {
  return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
}

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

function convertResultsToPromise(
  results: IPersonaProps[]
): Promise<IPersonaProps[]> {
  return new Promise<IPersonaProps[]>((resolve, reject) =>
    setTimeout(() => resolve(results), 2000)
  );
}

function getTextFromItem(persona: IPersonaProps): string {
  return persona.text as string;
}

function validateInput(input: string): ValidationState {
  if (input.indexOf("@") !== -1) {
    return ValidationState.valid;
  } else if (input.length > 1) {
    return ValidationState.warning;
  } else {
    return ValidationState.invalid;
  }
}

/**
 * Takes in the picker input and modifies it in whichever way
 * the caller wants, i.e. parsing entries copied from Outlook (sample
 * input: "Aaron Reid <aaron>").
 *
 * @param input The text entered into the picker.
 */
function onInputChange(input: string): string {
  const outlookRegEx = /<.*>/g;
  const emailAddress = outlookRegEx.exec(input);

  if (emailAddress && emailAddress[0]) {
    return emailAddress[0].substring(1, emailAddress[0].length - 1);
  }

  return input;
}
