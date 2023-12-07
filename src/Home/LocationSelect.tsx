import { useEffect, useRef, useState } from 'react';
import { useGeolocated } from 'react-geolocated';
import { useDisclosure, useInputState } from '@mantine/hooks';
import {
  Button,
  Combobox,
  Container,
  FocusTrap,
  Group,
  Input,
  InputBase,
  List,
  Loader,
  Modal,
  Text,
  useCombobox,
} from '@mantine/core';
import { useSearchLocation } from '../shared/queries/openWeather';

type SelectAsyncProps<T extends { label: string; value: unknown }> = {
  data: T[];
  value: T | null;
  onChange: (value: T) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  label?: string;
};

type Option = {
  label: string;
  value: string;
};

export function SelectAsync<T extends Option>({
  onSearch,
  onChange,
  data,
  value,
  isLoading,
  label,
  placeholder,
}: SelectAsyncProps<T>) {
  const [search, setSearch] = useInputState('');
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    onSearch(search);
  }, [search]);

  const combobox = useCombobox({
    onDropdownOpen: () => {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 0);
    },
  });

  const optionsMap = data.reduce<Record<string, T>>((acc, item) => {
    acc[`${item.value}`] = item;
    return acc;
  }, {});

  const options = data.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      {item.label}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        onChange(optionsMap[val]);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          label={label}
          component="button"
          type="button"
          pointer
          rightSection={isLoading ? <Loader size={18} /> : <Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
        >
          {value?.label || (
            <Input.Placeholder>
              {placeholder || 'Select value'}
            </Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <FocusTrap>
          <Combobox.Search
            ref={searchRef}
            value={search}
            onChange={setSearch}
            placeholder="Find location"
          />
        </FocusTrap>
        <Combobox.Options>
          {isLoading ? <Combobox.Empty>Loading....</Combobox.Empty> : options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

type LocationSelectProps = {
  value: Option;
  onChange: (value: Option) => void;
  setCurrentLocationOnMount?: boolean;
  label?: string;
};

export const currentLocationValue = `{{CURRENT_LOCATION}}`;

export const LocationSelect = ({
  label,
  value,
  onChange,
  setCurrentLocationOnMount = true,
}: LocationSelectProps) => {
  const [
    displayInstructionsModal,
    { open: showInstructionsModal, close: hideInstructionsModal },
  ] = useDisclosure(false);
  const [changeToCurrentLocation, setChangeToCurrentLocationOnInit] = useState(
    !setCurrentLocationOnMount,
  );
  const language = navigator.language.substring(0, 1);
  const [
    changeToCurrentLocationAfterPermissionsChange,
    setChangeToCurrentLocationAfterPermissionsChange,
  ] = useState(false);
  const [query, setQuery] = useState('');
  const { data = [], isFetching: isLoadingLocations } = useSearchLocation({
    query,
  });

  const onModalReject = () => {
    hideInstructionsModal();
    setChangeToCurrentLocationAfterPermissionsChange(false);
  };

  const currentLocation = useGeolocated({
    watchLocationPermissionChange: true,
    onSuccess: ({ coords: { longitude, latitude } }) => {
      if (!changeToCurrentLocation) {
        onChange({
          label: `Current location`,
          value: JSON.stringify({
            longitude,
            latitude,
          }),
        });
        setChangeToCurrentLocationOnInit(true);
      }
      if (changeToCurrentLocationAfterPermissionsChange) {
        setChangeToCurrentLocationAfterPermissionsChange(false);
        hideInstructionsModal();
        onChange({
          label: `Current location`,
          value: JSON.stringify({
            longitude,
            latitude,
          }),
        });
        return;
      }
    },
  });

  const options = [
    {
      label: 'Current location',
      value: currentLocationValue,
    },
    ...data!.map((value) => ({
      label: `${value.local_names?.[language] ?? value.name} ${value.state ? `(${value.state})` : ''}`,
      value: JSON.stringify({
        latitude: value.lat,
        longitude: value.lon,
      }),
    })),
  ];

  const onSelect = (selectedOption: Option) => {
    if (selectedOption.value === currentLocationValue) {
      if (!currentLocation.isGeolocationEnabled) {
        setChangeToCurrentLocationAfterPermissionsChange(true);
        showInstructionsModal();
        return;
      }

      onChange({
        label: 'Current location',
        value: JSON.stringify({
          longitude: currentLocation.coords!.longitude,
          latitude: currentLocation.coords!.latitude,
        }),
      });
      return;
    }
    onChange(selectedOption);
  };

  return (
    <>
      <Modal
        opened={displayInstructionsModal}
        title="Location Access Required"
        onClose={onModalReject}
        withCloseButton={false}
      >
        <Container p={'md'}>
          <Text>Please enable geolocation to use get current location.</Text>
          <List type="ordered">
            <List.Item>Go to your browser settings.</List.Item>
            <List.Item>Allow location access for this site.</List.Item>
          </List>
        </Container>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={onModalReject}>
            Cancel
          </Button>
        </Group>
      </Modal>
      <SelectAsync<Option>
        data={options ?? []}
        onChange={onSelect}
        onSearch={setQuery}
        placeholder="Select location"
        label={label}
        value={value}
        isLoading={isLoadingLocations}
      />
    </>
  );
};
