import {
  Facepile,
  IColumn,
  OverflowButtonType,
  Persona,
  PersonaSize,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
} from "@fluentui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const NewSessionTable = () => {
  const sessions = useSelector((state) => state.parsedSessions);

  const onRenderAttendees = (session) => {
    console.log(session.attendees);
    return (
      <Facepile
        overflowButtonType={OverflowButtonType.descriptive}
        showTooltip={false}
        personaSize={PersonaSize.size24}
        personas={session.attendees.map((attendee) => {
          console.log("attendee", attendee);
          return { personaName: attendee.name };
        })}
      />
    );
  };

  const onRenderDungeonMaster = (session) => {
    return (
      <Persona
        text={session.dungeonMaster?.name}
        coinSize={PersonaSize.size100}
      />
    );
  };

  const onRenderDate = (session) => {
    return new Date(session.date).toDateString();
  };

  const columns: IColumn[] = [
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 150,
    },
    {
      key: "dungeonMaster",
      name: "Dungeon Master",
      fieldName: "dungeonMaster",
      minWidth: 150,
      onRender: onRenderDungeonMaster,
    },
    {
      key: "attendees",
      name: "Attendees",
      fieldName: "attendees",
      minWidth: 150,
      onRender: onRenderAttendees,
    },
    {
      key: "date",
      name: "Date",
      fieldName: "scheduledDate",
      minWidth: 150,
      onRender: onRenderDate,
    },
  ];

  return (
    <Stack
      styles={{
        root: {
          display: "flex",
          flexFlow: "column nowrap",
          width: "auto",
          height: "auto",
          boxSizing: "border-box",
          maxHeight: "50%",
          overflow: "auto",
        },
      }}
    >
      <ShimmeredDetailsList
        columns={columns}
        enableShimmer={sessions.isLoading}
        items={sessions.isLoading ? [] : sessions.data}
        selectionMode={SelectionMode.none}
      />
    </Stack>
  );
};

export default NewSessionTable;
