import { Meta, Story } from "@storybook/react";
import React, { useState } from "react";

import { Toggle } from "./Toggle";
import css from "./Toggle.module.scss";
import { ToggleProps } from "./Toggle.type";

export default {
  title: "UI/Toggle",
  component: Toggle,
  parameters: {
    componentSubtitle: "Subtitle goes here",
  },
} as Meta;

const UncontrolledTemplate: Story<ToggleProps> = (args) => (
  <div className={css.Story}>
    <Toggle {...args} />
  </div>
);

const ControlledTemplate: Story<ToggleProps> = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;

    setChecked(target.checked);
  };

  return (
    <div className={css.Story}>
      <Toggle name="example" onChange={handleChange} checked={checked} />
    </div>
  );
};

const Uncontolled = UncontrolledTemplate.bind({});
const Controlled = ControlledTemplate.bind({});

Uncontolled.args = {
  label: "marklar",
};

Uncontolled.parameters = {
  docs: {
    storyDescription: "Story description",
  },
};

export { Uncontolled, Controlled };