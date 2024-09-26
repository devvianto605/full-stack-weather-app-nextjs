'use client';

import { useState } from 'react';
import { RefreshCcw, SquareMenu } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { LocationCard, CustomButton } from '@/components';
import type { GetWeatherDataFromLocationSearch } from '@/hooks/api/useGetWeatherDataFromLocationSearch';
import { useGetWeatherDataFromLocationSearch } from '@/hooks/api/useGetWeatherDataFromLocationSearch';
import { QUERY_KEY } from '@/hooks/api/query-key';
import useLocationStore from '@/stores/useLocationStore';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { ROUTE } from '@/routes';
import useTemperatureUnitStore from '@/stores/useTemperatureUnitStore';
import Logo from '@/assets/svg/logo.svg';

const IndexPage = () => {
  const [search, setSearch] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { unit, toggleUnit } = useTemperatureUnitStore();

  const { data: locationData } = useGetWeatherDataFromLocationSearch(
    debouncedSearch,
    unit,
  );
  const {
    addLocation,
    location: storedLocation,
    removeLocation,
  } = useLocationStore();

  const queryClient = useQueryClient();
  const router = useRouter();

  const handleToggleUnit = () => {
    toggleUnit();
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.OPEN_WEATHER] });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowPopover(true); // Show popover when typing
  };

  const handleSearchClickAdd = (
    searchData: GetWeatherDataFromLocationSearch,
  ) => {
    addLocation({
      id: searchData.location.place_id,
      displayPlace: searchData.location.display_place,
      displayAddress: searchData.location.display_address,
      lat: searchData.location.lat,
      lon: searchData.location.lon,
    });
    setSearch(''); // Clear the input after adding
    setShowPopover(false); // Hide the popover after selection
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.OPEN_WEATHER] });
  };
  const handleDetailSearch = () => {
    router.push(ROUTE.SEARCH);
  };

  return (
    <div className='container flex flex-col items-center justify-center gap-12'>
      <div className='flex flex-col justify-center text-center text-5xl font-extrabold tracking-tight'>
        <div className='flex justify-center'>
          <Logo height={200} width={200} />
        </div>
        <div>
          D² <span className='text-blue-200'>Weather Watch</span>
        </div>
      </div>

      {/* Input with popover and buttons */}
      <div className='relative max-w-[800px] w-full flex flex-col gap-2 items-center'>
        {/* Search Input Section */}
        <div className='flex flex-col w-full flex-1'>
          <input
            className='w-full p-3 rounded-lg bg-white/10 placeholder-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition'
            placeholder='Enter location...'
            value={search}
            onChange={handleSearchChange}
          />

          {/* Popover for location data */}
          {showPopover && locationData && locationData.length > 0 && (
            <div className='absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-lg bg-white text-black shadow-lg z-50'>
              {locationData.map((location, index) => (
                <p
                  key={index}
                  className='p-2 hover:bg-blue-100 cursor-pointer transition'
                  onClick={() => handleSearchClickAdd(location)}
                >
                  {location.location.display_name}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Button Section */}
        <div className='flex flex-col flex-grow md:flex-row gap-2 w-full md:w-auto '>
          {/* Detail Search Button */}
          <CustomButton
            icon={SquareMenu}
            label='Detailed Search'
            title='Detailed Search'
            onClick={handleDetailSearch}
          />

          {/* Unit Change Button */}
          <CustomButton
            className='min-w-[160px]'
            label={`Unit: ${unit.label}`}
            title='Change Unit'
            onClick={handleToggleUnit}
          />

          {/* Refresh Button */}
          <CustomButton
            icon={RefreshCcw}
            label='Refresh'
            title='Refresh Weather Data'
            onClick={handleRefresh}
          />
        </div>
      </div>

      {/* Location Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8'>
        {storedLocation.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            unit={unit}
            onDelete={() => removeLocation(location.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default IndexPage;
