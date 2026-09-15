// @vitest-environment jsdom
import {expect,it} from 'vitest';
import {makeObject} from '../src/studio/FabricBoard';
import {layer} from '../src/studio/document';
it.each(['rect','ellipse'] as const)('keeps %s render bounds equal to document dimensions',async kind=>{
 const definition={...layer(kind),x:100,y:180,width:300,height:220};
 const object=await makeObject(definition);
 expect(object.getBoundingRect()).toEqual({left:100,top:180,width:300,height:220});
 object.dispose();
});
