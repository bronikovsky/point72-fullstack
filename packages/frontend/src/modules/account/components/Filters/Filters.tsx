import * as React from 'react';
import { msg } from '../../../localization';
import { Select, Slider, TextField } from '../../../form';
import { useDictionaries } from '../../../dictionaries';
import classes from './Filters.module.scss';

type Props = {
  onChange: (search?: string, country?: string | undefined, age?: number[]) => void;
}

const Filters = (props: Props): React.ReactElement => {
  const { onChange } = props;
  const [search, setSearch] = React.useState('');
  const [country, setCountry] = React.useState<{ value: string, label: string } | null>(null);
  const [age, setAge] = React.useState<number[]>([1, 120]);
  const { countries } = useDictionaries();

  const countryOptions = React.useMemo(() => {
    return [{ value: '', label: msg('actions.select') }, ...countries.map(c => ({ value: c, label: c }))];
  }, [countries]);

  const onChangeSearch = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const onChangeCountry = React.useCallback((value: { value: string, label: string } | null) => {
    setCountry(value);
  }, []);

  const onChangeAge = React.useCallback((value: number[] | undefined | null | number) => {
    if (value) {
      setAge(value as number[]);
    }
  }, []);

  React.useEffect(() => {
    onChange(search, country?.value, age);
  }, [search, country, onChange, age]);

  return (
    <div className={classes.root}>
      <TextField name={'search'} onChange={onChangeSearch} value={search}/>
      <Slider
        className={classes.slider}
        defaultValue={[1, 120]}
        minDistance={2}
        value={age}
        label={msg('form.age.label')}
        onChange={onChangeAge}
        max={120}
        min={1}
      />
      <Select options={countryOptions} onChange={onChangeCountry} value={country} defaultValue={countryOptions[0]}/>
    </div>
  );
};

export default Filters;
