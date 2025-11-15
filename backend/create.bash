#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <module-name>"
  exit 1
fi

names="$1"
name="${names::-1}"

nest g module "$names"
nest g service "$names"
nest g controller "$names"

rm src/"$names"/"$names".controller.spec.ts
rm src/"$names"/"$names".service.spec.ts

mkdir -p src/"$names"/dto
mkdir -p src/"$names"/interfaces

createPath="src/$names/dto/create-$name.dto.ts"
updatePath="src/$names/dto/update-$name.dto.ts"
interfacePath="src/$names/interfaces/$name.interface.ts"

touch $createPath
touch $updatePath
touch $interfacePath

echo "export class Create${name^}Dto {" > $createPath
echo "" >> $createPath
echo "}" >> $createPath

echo "import { Create${name^}Dto } from './create-${name}.dto';" > $updatePath
echo "" >> $updatePath
echo "export class Update${name^}Dto extends Create${name^}Dto {}" >> $updatePath

echo "export interface ${name^} {" > $interfacePath
echo "" >> $interfacePath
echo "}" >> $interfacePath