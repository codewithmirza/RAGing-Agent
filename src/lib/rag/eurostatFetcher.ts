import axios from 'axios';

export class EurostatFetcher {
  private BASE_URL = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';
  
  async fetchDataset(datasetId: string) {
    try {
      // Simplified parameters with minimal data request
      const params = new URLSearchParams({
        format: 'JSON',
        lang: 'en'
      });

      // Add dataset-specific filters
      switch (datasetId) {
        case 'nama_10_gdp':
          params.append('geo', 'EU27_2020');
          params.append('time', '2023');
          params.append('unit', 'CP_MEUR');
          params.append('na_item', 'B1GQ');
          break;
        case 'prc_hicp_manr':
          params.append('geo', 'EA');
          params.append('time', '2023M12');
          params.append('coicop', 'CP00');
          break;
        case 'une_rt_m':
          params.append('geo', 'EU27_2020');
          params.append('time', '2023M12');
          params.append('age', 'TOTAL');
          params.append('unit', 'PC_ACT');
          break;
        case 'demo_pjan':
          params.append('geo', 'EU27_2020');
          params.append('time', '2023');
          params.append('age', 'TOTAL');
          params.append('sex', 'T');
          break;
      }

      console.log(`Fetching ${datasetId} with URL:`, `${this.BASE_URL}/${datasetId}?${params.toString()}`);

      const response = await axios.get(`${this.BASE_URL}/${datasetId}`, {
        params: params,
        timeout: 30000,
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        maxContentLength: 10000000, // 10MB max
        maxBodyLength: 10000000     // 10MB max
      });

      console.log(`Successfully fetched ${datasetId}`);
      return this.processResponse(response.data, datasetId);
    } catch (error: any) {
      console.error(`Error fetching dataset ${datasetId}:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      throw error;
    }
  }

  private processResponse(data: any, datasetId: string) {
    try {
      // Get the first value from the response
      const value = data.value ? Object.values(data.value)[0] : null;
      const dimensions = data.dimension || {};
      
      // Create a human-readable summary
      const summary = this.createSummary(datasetId, value, dimensions);

      const formattedData = {
        id: datasetId,
        timestamp: new Date().toISOString(),
        value,
        summary,
        metadata: {
          source: 'Eurostat',
          lastUpdate: data.updated || new Date().toISOString(),
          dataset: datasetId,
          description: this.getDatasetDescription(datasetId)
        }
      };

      return {
        id: datasetId,
        content: JSON.stringify(formattedData, null, 2),
        metadata: formattedData.metadata
      };
    } catch (error) {
      console.error('Error processing response:', error);
      throw error;
    }
  }

  private createSummary(datasetId: string, value: any, dimensions: any): string {
    switch (datasetId) {
      case 'nama_10_gdp':
        return `EU GDP in 2023: ${value} million euros`;
      case 'prc_hicp_manr':
        return `EU Inflation Rate (Dec 2023): ${value}%`;
      case 'une_rt_m':
        return `EU Unemployment Rate (Dec 2023): ${value}%`;
      case 'demo_pjan':
        return `EU Total Population (2023): ${value} persons`;
      default:
        return `${datasetId}: ${value}`;
    }
  }

  private getDatasetDescription(datasetId: string): string {
    const descriptions: Record<string, string> = {
      'nama_10_gdp': 'GDP and main components (output, expenditure and income)',
      'prc_hicp_manr': 'HICP - monthly data (annual rate of change)',
      'une_rt_m': 'Unemployment by sex and age - monthly average',
      'demo_pjan': 'Population on 1 January by age and sex'
    };
    return descriptions[datasetId] || datasetId;
  }
} 