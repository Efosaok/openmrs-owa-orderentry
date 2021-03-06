import React from 'react';

import { AddForm } from '../../../../app/js/components/drugOrderEntry/addForm/AddForm';

const {
  draftOrders, draftOrder, editOrder, formType, session,
} = mockData;

const props = {
  addDraftOrder: jest.fn(),
  createOrderReducer: jest.fn(),
  clearDrugForms: jest.fn(),
  clearSearchField: jest.fn(),
  setOrderAction: jest.fn(),
  setSelectedOrder: jest.fn(),
  removeOrder: jest.fn(),
  selectDrugSuccess: jest.fn(),
  setSelectedOrder: jest.fn(),
  getOrderEntryConfigurations: jest.fn(),
  activity: '',
  allConfigurations: {
    drugDosingUnits: [{ display: 'grams' }],
    orderFrequencies: [{ display: 'daily' }],
    drugRoutes: [{ display: 'eye drops' }],
    drugDispensingUnits: [{ display: 'kits' }],
    durationUnits: [{ display: 'months' }],
  },
  createOrderReducer: {
    addedOrder: {},
    errorMessage: '',
    status: {
      error: false,
      added: false,
    },
  },
  careSetting: { bdisplay: 'Outpatient', uuid: 'aaa1234' },
  drugName: 'Paracentamol',
  drugUuid: 'AJJJKW7378JHJ',
  draftOrder,
  draftOrders,
  editOrder,
  formType,
  session,
};

let mountedComponent;
const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = shallow(<AddForm {...props} />);
  }
  return mountedComponent;
};

describe('Test for adding a new drug order', () => {
  it('should render component', () => {
    const wrapper = shallow(<AddForm {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  describe('Outpatient orders', () => {
    const wrapper = mount(<AddForm {...props} />);
    describe('Activate and deactivate Confirm button under standard dosing form', () => {
      beforeEach(() => {
        wrapper.find('[name="dose"]').simulate('change', { target: { name: 'dose', value: 8 } });
        wrapper
          .find('[name="dosingUnit"]')
          .simulate('change', { target: { name: 'dosingUnit', value: 'kilogram' } });
        wrapper
          .find('[name="route"]')
          .simulate('change', { target: { name: 'route', value: 'oral' } });
        wrapper
          .find('[name="frequency"]')
          .simulate('change', { target: { name: 'frequency', value: 'once' } });
        wrapper
          .find('[name="durationUnit"]')
          .simulate('change', { target: { name: 'durationUnit', value: 'weeks' } });
      });
      it('should be deactivated without both dispensing quantity and units', () => {
        expect(wrapper.find('button.confirm').props().disabled).toBe(true);
      });
      it('should be deactivated with dispensing quantity without units', () => {
        wrapper
          .find('[name="dispensingQuantity"]')
          .simulate('change', { target: { name: 'dispensingQuantity', value: 12 } });
        expect(wrapper.find('button.confirm').props().disabled).toBe(true);
      });
      it('should be activated with both dispensing Quantity and units', () => {
        wrapper
          .find('[name="dispensingQuantity"]')
          .simulate('change', { target: { name: 'dispensingQuantity', value: 12 } });
        wrapper
          .find('[name="dispensingUnit"]')
          .simulate('change', { target: { name: 'dispensingUnit', value: 'kits' } });
        expect(wrapper.find('button.confirm').props().disabled).toBe(false);
      });
    });
    describe('Activate and deactivate Confirm button under free text form', () => {
      it('should activate when the required fields are filled', () => {
        wrapper.setState({ formType: 'Free Text' });
        expect(wrapper.state().formType).toEqual('Free Text');
        wrapper
          .find('[name="drugInstructions"]')
          .simulate('change', { target: { name: 'drugInstructions', value: '3 tablets' } });
        wrapper
          .find('[name="dispensingQuantity"]')
          .simulate('change', { target: { name: 'dispensingQuantity', value: 12 } });
        wrapper
          .find('[name="dispensingUnit"]')
          .simulate('change', { target: { name: 'dispensingUnit', value: 'kits' } });
        expect(wrapper.find('button.confirm').props().disabled).toBe(false);
      });
    });
    describe('Validation of fields', () => {
      beforeEach(() => {
        wrapper
          .find('[name="dispensingQuantity"]')
          .simulate('change', { target: { name: 'dispensingQuantity', value: 12 } });
        wrapper
          .find('[name="dispensingUnit"]')
          .simulate('change', { target: { name: 'dispensingUnit', value: 'tins' } });
      });
      it('should deactivate confirm button with invalid dose units', () => {
        wrapper.find('[name="dosingUnit"]').simulate('blur');
        expect(wrapper.find('button.confirm').props().disabled).toBe(true);
      });
      it('should display error with invalid dosing units', () => {
        wrapper.find('[name="dosingUnit"]').simulate('blur');
        expect(wrapper.find('span.field-error').length).toBe(1);
      });
      it('should activate with valid dose units', () => {
        wrapper
          .find('[name="dosingUnit"]')
          .simulate('change', { target: { name: 'dosingUnit', value: 'grams' } });
        wrapper.find('[name="dosingUnit"]').simulate('blur');
        expect(wrapper.find('button.confirm').props().disabled).toBe(false);
      });
      it('should deactivate with invalid frequency', () => {
        wrapper.find('[name="frequency"]').simulate('blur');
        expect(wrapper.find('button.confirm').props().disabled).toBe(true);
      });
      it('should deactivate with invalid route', () => {
        wrapper.find('[name="route"]').simulate('blur');
        expect(wrapper.find('button.confirm').props().disabled).toBe(true);
      });
      it('should deactivate with invalid dispensing unit', () => {
        wrapper.find('[name="dispensingUnit"]').simulate('blur');
        expect(wrapper.find('button.confirm').props().disabled).toBe(true);
      });
      it('should deactivate if duration is valid but duration unit is invalid', () => {
        wrapper
          .find('[name="duration"]')
          .simulate('change', { target: { name: 'duration', value: '1' } });
        wrapper.find('[name="durationUnit"]').simulate('blur');
        expect(wrapper.find('button.confirm').props().disabled).toBe(true);
      });
    });
  });
});

describe('Test AddForm state', () => {
  it('should update state', () => {
    mountedComponent = mount(<AddForm {...props} />);
    getComponent().setState({ fields: { dose: 11 } });
    getComponent()
      .find('[name="dose"]')
      .simulate('change', { target: { name: 'dose', value: 9 } });
    getComponent()
      .find('.confirm')
      .simulate('click');
    expect(getComponent().state().fields.dose).toEqual(9);
  });
});

describe('handleFormType() method', () => {
  it('should call handleFormType()', () => {
    const renderedComponent = getComponent().instance();
    sinon.spy(renderedComponent, 'handleFormType');
    renderedComponent.handleFormType(formType);
    expect(renderedComponent.handleFormType.calledOnce).toEqual(true);
    expect(getComponent().state('formType')).toEqual('Free Text');
  });
});

describe('handleFormTabs() method', () => {
  it('should call handleFormTabs()', () => {
    const renderedComponent = getComponent().instance();
    sinon.spy(renderedComponent, 'handleFormTabs');
    renderedComponent.handleFormTabs(1);
    expect(renderedComponent.handleFormTabs.calledOnce).toEqual(true);
    expect(getComponent().state('activeTabIndex')).toEqual(1);
  });
});

describe('handleCancel() method', () => {
  it('should call handleCancel()', () => {
    const renderedComponent = getComponent().instance();
    sinon.spy(renderedComponent, 'handleCancel');
    renderedComponent.handleCancel();
    expect(renderedComponent.handleCancel.calledOnce).toEqual(true);
  });
});

describe('populateEditOrderForm() method', () => {
  it('should call populateEditActiveOrderForm()', () => {
    const renderedComponent = getComponent().instance();
    sinon.spy(renderedComponent, 'populateEditOrderForm');
    renderedComponent.populateEditOrderForm();
    expect(renderedComponent.populateEditOrderForm.calledOnce).toEqual(true);
    expect(getComponent().state('activeTabIndex')).toEqual(1);
    expect(getComponent().state('fields')).toEqual({
      dispensingQuantity: '',
      dispensingUnit: '',
      dose: '',
      dosingUnit: '',
      drugInstructions: '',
      duration: '',
      durationUnit: '',
      frequency: '',
      reason: '',
      route: '',
    });
  });
});

describe('clearDrugForms() method', () => {
  it('should call clearDrugForms()', () => {
    const renderedComponent = getComponent().instance();
    sinon.spy(renderedComponent, 'clearDrugForms');
    renderedComponent.clearDrugForms();
    expect(renderedComponent.clearDrugForms.calledOnce).toEqual(true);
    expect(getComponent().state('fields')).toEqual({
      dispensingQuantity: '',
      dispensingUnit: '',
      dose: '',
      dosingUnit: '',
      drugInstructions: '',
      duration: '',
      durationUnit: '',
      frequency: '',
      reason: '',
      route: '',
    });
  });
});

describe('handleSubmitDrugForm() method', () => {
  it('should call handleSubmitDrugForm()', () => {
    const renderedComponent = getComponent().instance();
    sinon.spy(renderedComponent, 'handleSubmitDrugForm');
    renderedComponent.handleSubmitDrugForm();
    expect(renderedComponent.handleSubmitDrugForm.calledOnce).toEqual(true);
    expect(getComponent().state('draftOrder')).toEqual({
      action: 'NEW',
      careSetting: 'aaa1234',
      dosingType: 'org.openmrs.SimpleDosingInstructions',
      drug: 'AJJJKW7378JHJ',
      drugName: 'Paracentamol',
      orderNumber: 2,
      type: 'drugorder',
      orderer: '',
      previousOrder: null,
      dispensingQuantity: '',
      dispensingUnit: '',
      dose: '',
      dosingUnit: '',
      drugInstructions: '',
      duration: '',
      durationUnit: '',
      frequency: '',
      reason: '',
      route: '',
    });
  });
  it(`should call setSelectedOrder after calling handleSubmitDrugForm 
      if activity is DRAFT_ORDER_EDIT`, () => {
        const component = getComponent();
        const componentInstance = component.instance();
        component.setProps({ activity: 'DRAFT_ORDER_EDIT'});
        props.setSelectedOrder.mockReset();  
        expect(props.setSelectedOrder).toHaveBeenCalledTimes(0);            
        componentInstance.handleSubmitDrugForm();
        expect(props.setSelectedOrder).toHaveBeenCalledTimes(1); 
    });
  it('should call handleSubmitDrugForm()', () => {
    const component = getComponent().instance();
    const hhhSpy = jest.spyOn(component, 'handleSubmitDrugForm');
    component.setState({ action: 'NOT_NEW' });
    component.handleSubmitDrugForm();
    expect(hhhSpy).toHaveBeenCalledTimes(1);
    expect(component.state.draftOrder).toEqual({
      ...component.state.draftOrder,
      action: 'NOT_NEW',
    });
  });

  it('displays a toast with message if a drug has been added successfully', () => {
    expect(global.toastrMessage === 'Order Successfully Created').toBeFalsy();
    const wrapper = getComponent();
    wrapper.setProps({
      ...wrapper.props(),
     createOrderReducer: {
        errorMessage: '',
        addedOrder: { id: 1, type: 'testorder' },
        status: {
          added: true,
          error: false,
        },
      },
    });
    expect(global.toastrMessage).toEqual('Order Successfully Created');
  });

  it('displays a toast with message if a an error occured in adding drug', () => {
    const wrapper = getComponent();
    wrapper.setProps({
      ...wrapper.props(),
      createOrderReducer: {
        errorMessage: ["Order.cannot.have.more.than.one"],
        addedOrder: {},
        status: {
          added: false,
          error: true,
        },
      },
    });
    expect(global.toastrMessage).toEqual("Cannot have more than one active order for the same orderable and care setting at same time");
  });

  it('should change the selected order after a drug has been added', () => {
    const component = getComponent();
    props.setSelectedOrder.mockReset();
    component.setProps({
      createOrderReducer: {
        addedOrder: { order: 'just-a-sample-order' },
        status: { added: true, errror: false },
      },
    });
    expect(props.setSelectedOrder).toHaveBeenCalledTimes(1);
  });
});
