import React from 'react';
import { render, screen } from '@testing-library/react';
import { LogsVolumePanel } from './LogsVolumePanel';
import { ExploreId } from '../../types';
import { DataQueryResponse, LoadingState } from '@grafana/data';

jest.mock('./ExploreGraph', () => {
  const ExploreGraph = () => <span>ExploreGraph</span>;
  return {
    ExploreGraph,
  };
});

function renderPanel(logsVolumeData?: DataQueryResponse) {
  render(
    <LogsVolumePanel
      exploreId={ExploreId.left}
      loadLogsVolumeData={() => {}}
      absoluteRange={{ from: 0, to: 1 }}
      timeZone="timeZone"
      splitOpen={() => {}}
      width={100}
      onUpdateTimeRange={() => {}}
      logsVolumeData={logsVolumeData}
      onLoadLogsVolume={() => {}}
    />
  );
}

describe('LogsVolumePanel', () => {
  it('shows loading message', () => {
    renderPanel({ state: LoadingState.Loading, error: undefined, data: [] });
    expect(screen.getByText('Logs volume is loading...')).toBeInTheDocument();
  });

  it('shows no volume data', () => {
    renderPanel({ state: LoadingState.Done, error: undefined, data: [] });
    expect(screen.getByText('No volume data.')).toBeInTheDocument();
  });

  it('renders logs volume histogram graph', () => {
    renderPanel({ state: LoadingState.Done, error: undefined, data: [{}] });
    expect(screen.getByText('ExploreGraph')).toBeInTheDocument();
  });

  it('shows error message', () => {
    renderPanel({ state: LoadingState.Error, error: { data: { message: 'Test error message' } }, data: [] });
    expect(screen.getByText('Failed to load volume logs for this query')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('does not show the panel when there is no volume data', () => {
    renderPanel(undefined);
    expect(screen.queryByText('Logs volume')).not.toBeInTheDocument();
  });
});
