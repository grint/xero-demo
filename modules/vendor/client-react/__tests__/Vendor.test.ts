import { act, fireEvent, wait, waitForElement, RenderResult } from '@testing-library/react';

import { Renderer } from '@gqlapp/testing-client-react';

const createNode = (id: number) => ({
  id,
  name: `Vendor name ${id}`,
  vendorId: `Vendor id ${id}`,
  __typename: 'Vendor'
});

const mutations: any = {
  viewVendor: (id: any) => {}
};

const mocks = {
  Query: () => ({
    vendors(ignored: any, { after }: any) {
      const totalCount = 4;
      const edges = [];
      const vendorId = after < 1 ? +after + 1 : +after;
      for (let i = vendorId; i <= vendorId + 1; i++) {
        edges.push({
          cursor: i,
          node: createNode(i),
          __typename: 'VendorEdges'
        });
      }
      return {
        totalCount,
        edges,
        pageInfo: {
          endCursor: edges[edges.length - 1].cursor,
          hasNextPage: true,
          __typename: 'VendorPageInfo'
        },
        __typename: 'Vendors'
      };
    },
    vendor(obj: any, { id }: any) {
      return createNode(id);
    }
  }),
  Mutation: () => ({
    ...mutations
  })
};

describe('Vendors UI works', () => {
  const renderer = new Renderer(mocks, {});

  let dom: RenderResult;

  beforeAll(async () => {
    dom = renderer.mount();

    act(() => {
      renderer.history.push('/vendors');
    });

    await waitForElement(() => dom.getByText('Vendors'));
  });

  it('Vendors page renders with data', () => {
    expect(dom.getByText('Vendor name 1')).toBeDefined();
    expect(dom.getByText('Vendor name 2')).toBeDefined();
    expect(dom.getByText(RegExp(/2[\s]*\/[\s]*4/))).toBeDefined();
  });

  it('Opening vendor by URL works', async () => {
    act(() => {
      renderer.history.push('/vendors/4');
    });

    await wait(() => {
      expect(dom.getByText(/Vendor[\s]+Details/)).toBeDefined();
      expect(dom.getByDisplayValue('Vendor name 4')).toBeDefined();
      expect(dom.getByDisplayValue('Vendor id 4')).toBeDefined();
    });
  });

  it('Clicking back button takes to vendors list', async () => {
    const backButton = dom.getByText('Back');
    act(() => {
      fireEvent.click(backButton);
    });

    await waitForElement(() => dom.getByText('Vendor name 1'));
  });
});
