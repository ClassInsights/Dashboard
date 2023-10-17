"use client";

import Header from "@/app/components/Header";
import Container from "@/app/components/containers/Container";
import ListContainer from "@/app/components/containers/ListContainer";
import TextInput from "@/app/components/forms/TextInput";

const SettingsPage = () => {
  const details = [
    {
      name: "Aktuelles Jahr",
      value: "2023/24",
    },
    {
      name: "Start",
      value: "01.08.2023",
    },
    {
      name: "Ende",
      value: "31.07.2024",
    },
  ];

  return (
    <>
      <Header
        title="Einstellungen"
        subtitle="Hier kannst du das ClassInsights Ökosystem bearbeiten."
        previousPath="/"
      />
      <div className="flex select-none flex-col gap-4 sm:flex-row">
        <ListContainer title="Schuljahr">
          {details.map((detail) => (
            <div className="flex select-none justify-between" key={detail.name}>
              <p>{detail.name}</p>
              <p className="text-primary dark:text-dark-primary">
                {detail.value}
              </p>
            </div>
          ))}
        </ListContainer>
        <ListContainer title="Test">
          <TextInput
            onSubmit={(value) => console.log("Submitted", value)}
            placeholder="Test"
            style="tertiary"
          />
        </ListContainer>
      </div>
    </>
  );
};

export default SettingsPage;
