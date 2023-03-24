import { initializeAgent, Motion, agentMove } from "./Agent";
import { scheduleNextUpdate, updateApples, updateLost } from "./DrawingLibrary";
import { Cell, draw, GameScreen } from "./GameScreen";
import { Player } from "./Agent";

// a MaybeCell is either a Cell or the string "outside"
export type MaybeCell = Cell | "outside";

// a ScreenPart is a 5x5 array of MaybeCell arrays
export type ScreenPart = MaybeCell[][];

export class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class SnakeState extends Point {
  public apples: number;
  public lost: boolean;

  constructor(x: number, y: number) {
    super(x, y); // call Point constructor to set x and y
    this.apples = 0;
    this.lost = false;
  }

  public setPoint(p: Point): void {
    this.x = p.x;
    this.y = p.y;
  }
}

// x and y are the left and top coordinate of a 5x5 square region.
// cells outside the bounds of the board are represented with "outside"
export function getScreenPart(screen: GameScreen, s: SnakeState): ScreenPart {
  const part: ScreenPart = new Array<MaybeCell[]>(5);
  for (let j = 0; j < 5; j++) {
    part[j] = new Array<MaybeCell>(5);
    for (let i = 0; i < 5; i++) {
      if (s.x+i-2 >= 0 && s.y-2 + j >= 0 && s.x-2 + i < screen.length && s.y-2 + j < screen.length)
        part[j][i] = screen[s.y+j-2][s.x+i-2];
      else
        part[j][i] = "outside";
    }
  }
  return part;
}

// stepTime is a number of milliseconds
export function run(stepTime: number, newApplesEachStep: number, screen: GameScreen): void {
  initializeAgent("A");
  initializeAgent("B");
  initializeAgent("C");
  initializeAgent("D");

  // player initial positions
  const a = new SnakeState(0,0);
  const b = new SnakeState(screen.length - 1, 0);
  const c = new SnakeState(0, screen.length - 1);
  const d = new SnakeState(screen.length - 1, screen.length - 1);

  // draw starting screen
  screen[a.y][a.x] = "A";
  screen[b.y][b.x] = "B";
  screen[c.y][c.x] = "C";
  screen[d.y][d.x] = "D";
  draw(screen);

  // this will wait for stepTime milliseconds and then call step with these arguments
  scheduleNextUpdate(stepTime, () => step(stepTime, newApplesEachStep, screen, a, b, c, d));
  // the "() =>" part is important!
  // without it, step will get called immediately instead of waiting
}

function locationAfterMotion(motion: Motion, snake: SnakeState): Point {
  switch (motion) {
    case "left": return new Point(snake.x-1, snake.y);
    case "right": return new Point(snake.x+1, snake.y);
    case "up": return new Point(snake.x, snake.y-1);
    case "down": return new Point(snake.x, snake.y+1);
  }
}


//Took functionalities out and kept in 2 different function
export function step
(
  stepTime: number,newApplesEachStep: number,screen: GameScreen,
  snakeA: SnakeState,snakeB: SnakeState,
  snakeC: SnakeState,snakeD: SnakeState
): void 
{

    screen=newApples(newApplesEachStep,screen);

  if (!snakeA.lost) 
  {
    actions(screen,snakeA,"A");
  }

  if (!snakeB.lost) 
  {
    actions(screen,snakeB,"B");
  }

  if (!snakeC.lost) 
  {
    actions(screen,snakeC,"C");
  }

  if (!snakeD.lost)
  {
    actions(screen,snakeD,"D");
  }

//Function Definitions
  function newApples
  (
    newApplesEachStep:number,
    screen:GameScreen,
  ): GameScreen 
  {
    for (let i=1;i<=newApplesEachStep;i++) 
    {
  
      const M=Math.floor(screen.length*Math.random());
      const N=Math.floor(screen.length*Math.random());
  
      if (screen[N][M]==="empty")
        screen[N][M]="apple";
    }
  return screen;
  }
  
  
  function actions
  (
    screen: GameScreen,
    snakeState: SnakeState,
    player: Player,
  ): void 
  {
    const pos=locationAfterMotion(agentMove(player,getScreenPart(screen,snakeState)),snakeState);
  
    if (pos.y>=screen.length||pos.x>=screen.length||pos.x<0||pos.y<0)
      snakeState.lost=true;
  
    else
      switch (screen[pos.y][pos.x]) 
      {
        case "apple": 
        {
          snakeState.setPoint(pos);
          snakeState.apples++;
          screen[pos.y][pos.x]=player;
          break;
        }
  
        case "empty": 
        {
          snakeState.setPoint(pos);
          screen[pos.y][pos.x]=player;
          break;
        }
  
        default: 
        {
          snakeState.lost=true;
          break;
        }
      }
    }


  // update game screen
  draw(screen);

  // update snake statistics
  updateLost("A", snakeA.lost); updateApples("A", snakeA.apples);
  updateLost("B", snakeB.lost); updateApples("B", snakeB.apples);
  updateLost("C", snakeC.lost); updateApples("C", snakeC.apples);
  updateLost("D", snakeD.lost); updateApples("D", snakeD.apples);

  // run again unless everyone has lost
  if (!snakeA.lost || !snakeB.lost || !snakeC.lost || !snakeD.lost)
    scheduleNextUpdate(stepTime, () => step(stepTime, newApplesEachStep, screen, snakeA, snakeB, snakeC, snakeD));
}
