
# Alignment Tracker

This tool was written to cover a need I had, while running a roleplaying game with my players. Many players would declare that their character was one alignment, but during game play, I noticed that their actions were more chaotic, when they declared to be lawful, or they played their character more evil, when they stated their character was good.  It's not the players fault, generally character alignments are not really considered during character creation, and seldom are they even selected for the character.

This tool allows the gamemaster to keep track of the character's actions, and tweak the character's alignment based on these actions.  Then be able to have it presented in a graph format, to then do what you wish in your game setting/story.

* Did the character do something "good" (did something to the benefit of others, at a sacrifice of the character's needs or wants?) Tick a few times (based on the amplitude of the action) adjusting the character's alignment towards "good".
* Is the character a "murder-hobo," that seeks to gain from the loss of others?  Seeking ultimate power, by stepping on heads (sometimes literally?)  Tick to adjust the character's alignment towards "evil".
* Does the character act based on a set of law, principles or general guidelines, even if it is the character's own set of rules? Tick to adjust the alignment towards "lawful".
* Or is the character actions random?  One time they will do this, the next do the other, with no rhyme or reason? Tick to adjust the alignment towards "chaotic."

In the end, it doesn't change anything with the gameplay, but could be used by gamemasters that want to incorporate the characters actions into the storyline: Maybe your "lawful good" paladin actually tends to play more as "lawful evil" and they come across a cursed weapon that only evil characters can handle without having damage inflicted upon them.  Looking at the graph will show this.  Truly the applications are endless.

This is all wrapped up in an easy to use UI interface, so the gamemaster is not burdened with any of the details. 

But this module also has an API exposed for developers that wish to interface with the alignment tracker for their needs.
## API Reference

#### Get all the alignment trackers for the game mapped by userId

```
  trackers(userId) = getAllTrackers()
```

#### Get an array of all the alignment trackers for a specific user

```
  trackers[] = getTrackersForUser(userId)
```

| Parameter | Type     | Description                                    |
| :-------- | :------- | :--------------------------------------------- |
| `userId`  | `string` | **Required**. User's UUID assigned by Foundry  |

#### Get an alignment tracker for a specific tracker id

```
  tracker = getByTrackerId(trackerId)
```

| Parameter    | Type     | Description                                     |
| :----------- | :------- | :---------------------------------------------- |
| `trackerId`  | `string` | **Required**. Tracker UUID assigned by Foundry  |

#### Get an alignment tracker for a specific actor id

```
  tracker = getByActorId(actorId)
```

| Parameter  | Type     | Description                                   |
| :--------- | :------- | :-------------------------------------------- |
| `actorId`  | `string` | **Required**. Actor UUID assigned by Foundry  |

#### Create a new alignment tracker

```
  tracker = create(userId, actorId)
```

| Parameter  | Type     | Description                                   |
| :--------- | :------- | :-------------------------------------------- |
| `userId`   | `string` | **Required**. User's UUID assigned by Foundry |
| `actorId`  | `string` | **Required**. Actor UUID assigned by Foundry  |

#### Update an alignment tracker for a specific tracker id

```
  tracker = updateByTrackerId(trackerId, alignmentObject)
```

| Parameter          | Type     | Description                                     |
| :----------------- | :------- | :---------------------------------------------- |
| `trackerId`        | `string` | **Required**. Tracker UUID assigned by Foundry  |
| `alignmentObject`  | `object` | **Required**. See below for structure           |

``` 
  alignmentObject: 
  Can supply one or both attributes, and must be a value between 0 and maxValue (defined in tracker.)

  {
    chaosLevel: 45, 
    evilLevel: 10
  }
``` 

#### Update an alignment tracker for a specific actor id

```
  tracker = updateByActorId(actorId)
```

| Parameter          | Type     | Description                                   |
| :----------------- | :------- | :-------------------------------------------- |
| `actorId`          | `string` | **Required**. Actor UUID assigned by Foundry  |
| `alignmentObject`  | `object` | **Required**. See below for structure         |

``` 
  alignmentObject: 
  Can supply one or both attributes, and must be a value between 0 and maxValue (defined in tracker.)

  {
    chaosLevel: 45, 
    evilLevel: 10
  }
``` 

#### Adjust the Lawful/Chaotic level of an alignment tracker for a specific tracker id

```
  tracker = adjustChaoticByTrackerId(trackerId, adjustment)
```

| Parameter     | Type      | Description                                                                  |
| :------------ | :-------- | :--------------------------------------------------------------------------- |
| `trackerId`   | `string`  | **Required**. Tracker UUID assigned by Foundry                               |
| `adjustment`  | `integer` | **Required**. Negative numbers move towards lawful, positive towards chaotic |

#### Adjust the Lawful/Chaotic level of an alignment tracker for a specific actor id

```
  tracker = adjustChaoticByActorId(actorId, adjustment)
```

| Parameter     | Type      | Description                                                                  |
| :------------ | :-------- | :--------------------------------------------------------------------------- |
| `actorId`     | `string`  | **Required**. Actor UUID assigned by Foundry                                 |
| `adjustment`  | `integer` | **Required**. Negative numbers move towards lawful, positive towards chaotic |

#### Adjust the Good/Evil level of an alignment tracker for a specific tracker id

```
  tracker = adjustEvilByTrackerId(trackerId, adjustment)
```

| Parameter     | Type      | Description                                                             |
| :------------ | :-------- | :---------------------------------------------------------------------- |
| `trackerId`   | `string`  | **Required**. Tracker UUID assigned by Foundry                          |
| `adjustment`  | `integer` | **Required**. Negative numbers move towards good, positive towards evil |

#### Adjust the Good/Evil level of an alignment tracker for a specific actor id

```
  tracker = adjustEvilByActorId(actorId, adjustment)
```

| Parameter     | Type      | Description                                                             |
| :------------ | :-------- | :---------------------------------------------------------------------- |
| `actorId`     | `string`  | **Required**. Actor UUID assigned by Foundry                            |
| `adjustment`  | `integer` | **Required**. Negative numbers move towards good, positive towards evil |

#### Delete alignment tracker for a specific tracker id

```
  deleteByTrackerId(trackerId)
```

| Parameter     | Type      | Description                                    |
| :------------ | :-------- | :--------------------------------------------- |
| `trackerId`   | `string`  | **Required**. Tracker UUID assigned by Foundry |

#### Delete alignment tracker for a specific tracker id

```
  deleteByActorId(actorId)
```

| Parameter     | Type      | Description                                   |
| :------------ | :-------- | :-------------------------------------------- |
| `actorId`     | `string`  | **Required**. Actor UUID assigned by Foundry  |

#### Delete all the alignment trackers for a specific user id

```
  deleteAllByUserId(userId)
```

| Parameter     | Type      | Description                                  |
| :------------ | :-------- | :------------------------------------------- |
| `userId`      | `string`  | **Required**. User UUID assigned by Foundry  |

#### Delete all the alignment trackers for all users

```
  deleteAll()
```
