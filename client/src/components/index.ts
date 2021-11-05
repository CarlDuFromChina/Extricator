import assert from '../utils/assert';
import View from './view.vue';
import Header from './header.vue';

const prefix = 'sp';
const components = [View, Header];

export default {
  install: (app: any, options: any) => {
    components.forEach(component => {
      if (assert.isEmpty(component.partialName)) {
        throw Error('custom component must have a name');
      }
      const keyName = `${prefix}-${component.partialName}`;
      app.component(keyName, component);
    });
  }
}